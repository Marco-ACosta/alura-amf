import { graduationStoreValidator } from '#validators/graduation'
import type { HttpContext } from '@adonisjs/core/http'
import helpers from '../utils/helpers.js'
import { getUnixTime } from 'date-fns'
import graduation_service from '#services/graduation_service'
import { PaginationDefault } from '../utils/consts.js'
import app from '@adonisjs/core/services/app'

export default class GraduationsController {
  async list({ request }: HttpContext) {
    const qs = request.qs()
    const { page = PaginationDefault.page, limit = PaginationDefault.limit } = qs
    const { isActive } = qs
    const { search } = qs
    const { column = 'name', direction = 'asc' } = qs
    return await graduation_service.listGraduations(
      column,
      direction,
      isActive,
      search,
      page,
      limit
    )
  }

  async store({ request }: HttpContext) {
    const data = await request.validateUsing(graduationStoreValidator)
    const graduationData = {
      name: data.name,
      color: data.color,
      description: data.description,
      slug: helpers.slugFy(data.name),
      createdAt: getUnixTime(new Date()),
    }
    await graduation_service.createGraduation(graduationData, data.icon)
    return { success: [{ message: 'Graduação criada com sucesso.', status: 200 }] }
  }

  async show({ params }: HttpContext) {
    const { id } = params
    return await graduation_service.showOneGraduation(id)
  }

  async downloadIcon({ params, response }: HttpContext) {
    const { id } = params
    const graduation = await graduation_service.getOneGraduation(id)
    const path = app.makePath(graduation.icon.archive.filePath)
    return response.download(path)
  }

  // async update({ params, request }: HttpContext) {}

  // async restore({ params }: HttpContext) {}

  // async destroy({ params }: HttpContext) {}

  // async delete({ params }: HttpContext) {}
}
