import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Icon from '#models/icon'

export default class Graduation extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare color: string

  @column()
  declare description: string

  @column()
  declare slug: string

  @column()
  declare isActive: boolean

  @column()
  declare deletedAt?: number | null

  @column()
  declare createdAt: number

  @hasOne(() => Icon)
  declare icon: HasOne<typeof Icon>
}
