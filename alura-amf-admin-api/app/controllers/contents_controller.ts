import type { HttpContext } from '@adonisjs/core/http'
import { createVideoValidator } from '#validators/video'
import { createArticleValidator } from '#validators/article'
import { createAudioValidator } from '#validators/audio'
import archive_service from '#services/archive_service'
import { DateTime } from 'luxon'
import Content from '#models/content'
import VideoService from '#services/video_service'
import Video from '#models/video'
import Thumbnail from '#models/thumbnail'
import Audio from '#models/audio'
import Article from '#models/article'
import { getUnixTime } from 'date-fns'
export default class ContentsController {
  async store({ request, params }: HttpContext) {
    const { type } = params
    if (type === 'video') {
      const data = await request.validateUsing(createVideoValidator)

      const videoFile = data.video
      const thumbnailFile = data.thumbnail

      const archive = await archive_service.createOne(videoFile, 'video')
      const thumbnailArchive = await archive_service.createOne(thumbnailFile, 'thumbnail')

      const contentData = {
        type: type,
        title: data.title,
        isActive: true,
        releaseDate: DateTime.fromJSDate(data.releaseDate).toUnixInteger(),
        createAt: getUnixTime(new Date()),
      }
      const content = await Content.create(contentData)

      const duration = await VideoService.getVideoDuration(archive.filePath)
      const videoData = {
        archiveId: archive.id,
        contentId: content.id,
        description: data.description,
        duration: duration,
      }

      const thumbnailData = {
        archiveId: thumbnailArchive.id,
        contentId: content.id,
        format: '1080x1080',
      }

      await Video.create(videoData)
      await Thumbnail.create(thumbnailData)
    }
    if (type === 'audio') {
      const data = await request.validateUsing(createAudioValidator)
      const audioFile = data.audio
      const thumbnailFile = data.thumbnail

      const archive = await archive_service.createOne(audioFile, 'audio')
      const thumbnailArchive = await archive_service.createOne(thumbnailFile, 'thumbnail')

      const contentData = {
        type: type,
        title: data.title,
        isActive: true,
        releaseDate: DateTime.fromJSDate(data.releaseDate).toUnixInteger(),
        createAt: getUnixTime(new Date()),
      }
      const content = await Content.create(contentData)

      const duration = await VideoService.getVideoDuration(archive.filePath)
      const audioData = {
        archiveId: archive.id,
        contentId: content.id,
        description: data.description,
        duration: duration,
      }

      const thumbnailData = {
        archiveId: thumbnailArchive.id,
        contentId: content.id,
        format: '1080x1080',
      }

      await Audio.create(audioData)
      await Thumbnail.create(thumbnailData)
    }
    if (type === 'article') {
      const data = await request.validateUsing(createArticleValidator)
      const articleFile = data.article
      const thumbnailFile = data.thumbnail

      const archive = await archive_service.createOne(articleFile, 'article')
      const thumbnailArchive = await archive_service.createOne(thumbnailFile, 'thumbnail')

      const contentData = {
        type: type,
        title: data.title,
        isActive: true,
        releaseDate: DateTime.fromJSDate(data.releaseDate).toUnixInteger(),
        createAt: getUnixTime(new Date()),
      }
      const content = await Content.create(contentData)

      const articleData = {
        archiveId: archive.id,
        contentId: content.id,
        subtitle: data.subtitle,
      }

      const thumbnailData = {
        archiveId: thumbnailArchive.id,
        contentId: content.id,
        format: '1080x1080',
      }

      await Article.create(articleData)
      await Thumbnail.create(thumbnailData)
    }
  }
}
