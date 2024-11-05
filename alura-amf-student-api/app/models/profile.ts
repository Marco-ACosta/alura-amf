import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { getUnixTime } from 'date-fns'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare type: string

  @column()
  declare lastName: string

  @column()
  declare phone: string

  @column()
  declare isActive: boolean

  @column()
  declare deletedAt?: number | null

  @column()
  declare createdAt: number

  @beforeCreate()
  static assignCreatedAt(profile: Profile) {
    profile.createdAt = getUnixTime(new Date())
  }
}
