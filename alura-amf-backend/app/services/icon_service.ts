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
}
