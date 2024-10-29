import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Archive extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare fileName: string

  @column()
  declare filePath: string

  @column()
  declare fileType: string

  @column()
  declare fileSize: number

  @column()
  declare createdAt: number

  @column()
  declare updatedAt: number
}
