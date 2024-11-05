import { BaseModel, column, hasManyThrough, hasOne } from '@adonisjs/lucid/orm'
import type { HasManyThrough, HasOne } from '@adonisjs/lucid/types/relations'
import Icon from '#models/icon'
import GraduationStudent from '#models/graduation_student'
import Student from '#models/student'

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

  @hasManyThrough([() => Student, () => GraduationStudent])
  declare students: HasManyThrough<typeof Student>
}
