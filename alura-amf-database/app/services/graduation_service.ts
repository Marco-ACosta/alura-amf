import Graduation from '#models/graduation'
import db from '@adonisjs/lucid/services/db'
import icon_service from './icon_service.js'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { format } from 'date-fns'

export default {
  async createGraduation(data: Partial<Graduation>, file: MultipartFile) {
    const graduation = await this.storeGraduation(data)
    await icon_service.createIcon(graduation.id, file)
    return graduation
  },
  async storeGraduation(data: Partial<Graduation>) {
    return await db.transaction(async (trx) => await Graduation.create(data, { client: trx }))
  },
  async listGraduations(
    column: string,
    direction: 'asc' | 'desc',
    isActive?: boolean,
    search?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const graduations = await Graduation.query()
      .whereNull('deletedAt')
      .if(search, (query) => query.where('name', 'like', `%${search}%`))
      .if(isActive, (query) => query.where('isActive', isActive!))
      .if(!isActive, (query) => query.where('isActive', !isActive!))
      .orderBy(column, direction)
      .paginate(page, limit)
    const { data, meta } = graduations.serialize()
    const dataGraduation = data.map((graduation) => ({
      id: graduation.id,
      name: graduation.name,
      color: graduation.color,
      isActive: graduation.isActive,
      createdAt: format(new Date(graduation.createdAt * 1000), 'dd/MM/yyyy'),
      icon: `graduation/${graduation.id}/icon`,
    }))
    return { meta, data: dataGraduation }
  },
  async getOneGraduation(id: string) {
    return await Graduation.query()
      .where('id', id)
      .preload('icon', (query) => {
        query.preload('archive')
      })
      .firstOrFail()
  },
  async showOneGraduation(id: string) {
    const graduation = await this.getOneGraduation(id)
    return {
      id: graduation.id,
      name: graduation.name,
      color: graduation.color,
      description: graduation.description,
      icon: `graduation/${graduation.id}/icon`,
      createdAt: format(new Date(graduation.createdAt * 1000), 'dd/MM/yyyy'),
      isActive: graduation.isActive,
    }
  },

  async updateGraduation(id: string, data: Partial<Graduation>, file: MultipartFile) {
    await Graduation.query().where('id', id).update(data)
    if (file) {
      await icon_service.editIcon(id, file)
    }
  },
}
