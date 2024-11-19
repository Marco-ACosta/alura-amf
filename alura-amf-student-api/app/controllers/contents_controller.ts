import Content from '#models/content'
import type { HttpContext } from '@adonisjs/core/http'
import { getUnixTime } from 'date-fns'
import fs from 'node:fs'
import path from 'node:path'

export default class ContentsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const contents = await Content.query()
      .whereNull('deleted_at')
      .andWhere('release_date', '<=', getUnixTime(new Date()))
      .preload('article')
      .preload('audio')
      .preload('video')
      .preload('thumbnail', (query) => {
        query.preload('archive')
      })

    return contents.map((content) => ({
      id: content.id,
      type: content.type,
      title: content.title,
      isActive: content.isActive,
      createdAt: content.createdAt,
      thumbnail: `content/download/thumbnail/${content.thumbnail.archive.fileName}`,
      thumbnailFormat: content.thumbnail.format,
      duration:
        content.type === 'video' || content.type === 'audio'
          ? content[`${content.type}`].duration
          : '-',
    }))
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const { id } = params
    const content = await Content.findOrFail(id)
    let contentData
    await content.load('thumbnail', (query) => {
      query.preload('archive')
    })

    if (content.type === 'video') {
      await content.load('video', (query) => {
        query.preload('archive')
      })

      contentData = {
        duration: content.video.duration,
        description: content.video.description,
        path: `content/download/${content.type}/${content.video.archive.fileName}`,
      }
    }

    return {
      id: content.id,
      type: content.type,
      title: content.title,
      isActive: content.isActive,
      createdAt: content.createdAt,
      thumbnail: `content/download/thumbnail/${content.thumbnail.archive.fileName}`,
      thumbnailFormat: content.thumbnail.format,
      ...contentData,
    }
  }

  public async download({ params, response }: HttpContext) {
    const { type, fileName } = params

    if (type === 'video') {
      const videoPath = path.resolve(
        import.meta.dirname,
        `../../../alura-amf-database/uploads/${type}/${fileName}`
      )

      // Lê o arquivo de vídeo completo
      const videoBuffer = fs.readFileSync(videoPath)

      // Define os cabeçalhos apropriados
      response.header('Content-Length', videoBuffer.length.toString())
      response.header('Content-Type', 'video/mp4')

      // Envia o vídeo como resposta
      response.send(videoBuffer)
    }

    if (type === 'thumbnail') {
      const thumbnailPath = path.resolve(
        import.meta.dirname,
        `../../../alura-amf-database/uploads/${type}/${fileName}`
      )

      // Lê o arquivo de thumbnail completo
      const thumbnailBuffer = fs.readFileSync(thumbnailPath)

      // Define os cabeçalhos apropriados
      response.header('Content-Length', thumbnailBuffer.length.toString())
      response.header('Content-Type', 'image/jpeg')

      // Envia o thumbnail como resposta
      response.send(thumbnailBuffer)
    }
  }
}
