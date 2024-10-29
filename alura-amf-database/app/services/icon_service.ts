import Icon from '#models/icon'
import db from '@adonisjs/lucid/services/db'
import archive_service from './archive_service.js'
import { MultipartFile } from '@adonisjs/core/bodyparser'

export default {
  async createIcon(graduationId: string, file: MultipartFile) {
    const archive = await archive_service.createOne(file)
    const data = {
      graduationId,
      archiveId: archive.id,
    }

    return await this.storeIcon(data)
  },

  async storeIcon(data: Partial<Icon>) {
    return await db.transaction(async (trx) => await Icon.create(data, { client: trx }))
  },

  async updateIcon(id: string, data: Partial<Icon>) {
    return await db.transaction(
      async (trx) => await Icon.updateOrCreate({ id: id }, data, { client: trx })
    )
  },

  async editIcon(graduationId: string, file: MultipartFile) {
    const icon = await Icon.query().where('graduationId', graduationId).firstOrFail()
    await archive_service.deleteOne(icon.archiveId)
    const newArchive = await archive_service.createOne(file)
    await this.updateIcon(icon.id, { archiveId: newArchive.id })
  },
}
