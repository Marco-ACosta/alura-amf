import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Graduation from '#models/graduation'
import Student from '#models/student'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
export default class GraduationStudent extends BaseModel {
  public static table = 'graduations_students'
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare graduationId: string

  @column()
  declare studentId: string

  @belongsTo(() => Graduation)
  declare graduation: BelongsTo<typeof Graduation>

  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>
}
