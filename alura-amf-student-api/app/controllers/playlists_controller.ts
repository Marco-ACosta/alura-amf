import type { HttpContext } from '@adonisjs/core/http'
import Playlist from '#models/playlist'
import {
  addContentToPlaylistValidator,
  createPlaylistValidator,
  removeContentFromPlaylistValidator,
  updatePlaylistValidator,
} from '#validators/playlist'
import helpers from '../utils/helpers.js'
import ContentPlaylist from '#models/content_playlist'
import { format, fromUnixTime } from 'date-fns'
export default class PlaylistsController {
  /**
   * Handle form submission for the create action
   */
  async store({ request, auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(createPlaylistValidator)
    const slug = helpers.slugfy(data.name)
    const playlistData = {
      name: data.name,
      slug,
      description: data.description,
      isPublic: data.isPublic ?? false,
      studentsId: user.id,
    }
    await Playlist.create({ ...playlistData })
    return response.json({ success: [{ message: 'Playlist criada com sucesso', status: 201 }] })
  }

  /**
   * Display a list of resource
   */
  async index({ params, auth }: HttpContext) {
    const { userId } = params
    const user = await auth.authenticate()
    const isStudent = user.id === userId
    const playlists = await Playlist.query()
      .where('students_id', userId)
      .if(!isStudent, (query) => {
        query.where('is_public', true)
      })
      .withCount('contents')

    return playlists.map((playlist) => ({
      ...playlist.serialize(),
      contentCount: playlist.$extras.contents_count,
    }))
  }

  /**
   * Show individual record
   */
  async show({ params, auth }: HttpContext) {
    const { id } = params
    const { userId } = params
    const user = await auth.authenticate()
    const isStudent = user.id === userId

    const playlist = await Playlist.query()
      .where('id', id)
      .preload('contentPlaylists', (query) => {
        query
          .preload('content', (queryContent) =>
            queryContent
              .preload('article')
              .preload('audio')
              .preload('video')
              .preload('thumbnail', (queryThumbnail) => queryThumbnail.preload('archive'))
          )
          .orderBy('order', 'asc')
      })
      .firstOrFail()

    if (!isStudent && !playlist.isPublic) {
      throw new Error('Playlist is not public')
    }

    return {
      id: playlist.id,
      name: playlist.name,
      slug: playlist.slug,
      description: playlist.description,
      isPublic: playlist.isPublic,
      studentsId: playlist.studentsId,
      contentCount: playlist.contentPlaylists.length,
      contents: playlist.contentPlaylists.map((contentPlaylist) => ({
        id: contentPlaylist.contentId,
        order: contentPlaylist.order,
        type: contentPlaylist.content.type,
        title: contentPlaylist.content.title,
        isActive: contentPlaylist.content.isActive,
        releaseDate: format(fromUnixTime(contentPlaylist.content.releaseDate), 'dd/MM/yyyy'),
        createdAt: contentPlaylist.content.createdAt,
        thumbnail: `content/download/thumbnail/${contentPlaylist.content.thumbnail.archive.fileName}`,
        thumbnailFormat: contentPlaylist.content.thumbnail.format,
        duration:
          contentPlaylist.content.type === 'video' || contentPlaylist.content.type === 'audio'
            ? contentPlaylist.content[`${contentPlaylist.content.type}`].duration
            : '-',
      })),
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, auth, response }: HttpContext) {
    const { id } = params
    const { userId } = params
    const user = await auth.authenticate()

    if (user.id !== userId) {
      throw new Error('You are not allowed to update this playlist')
    }

    const data = await request.validateUsing(updatePlaylistValidator)
    const playlist = await Playlist.query()
      .where('id', id)
      .preload('contentPlaylists')
      .firstOrFail()

    const dataPlaylist = {
      name: data.name ?? playlist.name,
      slug: helpers.slugfy(data.name ?? playlist.name),
      description: data.description,
      isPublic: data.isPublic ?? playlist.isPublic,
    }

    await playlist.merge(dataPlaylist).save()

    if (data.contents) {
      playlist.contentPlaylists.forEach(async (contentPlaylist) => {
        const contentData = data.contents?.find((content) => {
          return content.contentId === contentPlaylist.contentId
        })
        contentPlaylist.merge({ order: contentData?.order ?? contentPlaylist.order }).save()
      })
    }

    return response.json({ success: [{ message: 'Playlist atualizada com sucesso', status: 201 }] })
  }

  async addContent({ request, params }: HttpContext) {
    const { id } = params
    const data = await request.validateUsing(addContentToPlaylistValidator)

    const lastContent = await ContentPlaylist.query()
      .where('playlist_id', id)
      .orderBy('order', 'desc')
      .first()

    await ContentPlaylist.create({
      contentId: data.contentId,
      order: lastContent ? lastContent.order + 1 : 1,
      playlistId: id,
    })

    return { success: [{ message: 'Conteúdo adicionado na playlist com sucesso', status: 201 }] }
  }

  async removeContent({ request, params }: HttpContext) {
    const { id } = params
    const data = await request.validateUsing(removeContentFromPlaylistValidator)
    const contentPlaylist = await ContentPlaylist.query()
      .where('playlist_id', id)
      .where('content_id', data.contentId)
      .firstOrFail()

    const playlistContents = await ContentPlaylist.query()
      .where('playlist_id', id)
      .where('order', '>', contentPlaylist.order)
      .orderBy('order', 'asc')

    playlistContents.forEach(async (content) => {
      await content.merge({ order: content.order - 1 }).save()
    })

    await contentPlaylist.delete()

    return { success: [{ message: 'Conteúdo removido da playlist com sucesso', status: 201 }] }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const { id } = params
    const playlist = await Playlist.query().where('id', id).firstOrFail()
    await playlist.delete()
    return response.json({ success: [{ message: 'Playlist deletada com sucesso', status: 201 }] })
  }
}
