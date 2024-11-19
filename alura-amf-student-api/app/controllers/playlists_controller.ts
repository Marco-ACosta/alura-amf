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
export default class PlaylistsController {
  /**
   * Handle form submission for the create action
   */
  async store({ request, auth }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(createPlaylistValidator)
    const slug = helpers.slugfy(data.name)
    const playlistData = {
      name: data.name,
      slug,
      description: data.description,
      isPublic: data.isPublic ?? false,
      studentId: user.id,
    }
    const playlist = await Playlist.create({ ...playlistData })
    return playlist
  }

  /**
   * Display a list of resource
   */
  async index({ params, auth }: HttpContext) {
    const { userId } = params
    const user = await auth.authenticate()
    const isStudent = user.id === userId
    const playlists = await Playlist.query()
      .where('student_id', userId)
      .if(!isStudent, (query) => {
        query.where('is_public', true)
      })
      .withCount('contents')

    return playlists
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
          .preload('content', (queryContent) => queryContent.preload('thumbnail'))
          .orderBy('order', 'asc')
      })
      .firstOrFail()
    if (!isStudent && !playlist.isPublic) {
      throw new Error('Playlist is not public')
    }
    return playlist
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, auth }: HttpContext) {
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
  }

  async addContent({ request, params }: HttpContext) {
    const { id } = params
    const data = await request.validateUsing(addContentToPlaylistValidator)
    const lastContent = await ContentPlaylist.query()
      .where('playlist_id', id)
      .orderBy('order', 'desc')
      .first()

    const isOnPlaylist = await ContentPlaylist.query()
      .where('playlist_id', id)
      .where('content_id', data.contentId)
      .first()

    if (isOnPlaylist) {
      throw new Error('Conteudo ja esta na playlist')
    }

    await ContentPlaylist.create({
      id,
      contentId: data.contentId,
      order: lastContent ? lastContent.order + 1 : 1,
    })
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
