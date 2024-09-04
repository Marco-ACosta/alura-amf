import { BaseModel, beforeCreate, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { getUnixTime } from 'date-fns'
import Admin from '#models/admin'

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

  @hasOne(() => Admin)
  declare admin: HasOne<typeof Admin>
}
