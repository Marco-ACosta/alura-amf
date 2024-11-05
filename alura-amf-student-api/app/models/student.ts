import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeSave, belongsTo, column, hasManyThrough } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasManyThrough } from '@adonisjs/lucid/types/relations'
import Profile from '#models/profile'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import GraduationStudent from '#models/graduation_student'
import Graduation from '#models/graduation'
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class Student extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare profileId: string

  @column()
  declare academicRegister: string

  @column()
  declare cpf: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare verificationCode?: string | null

  @belongsTo(() => Profile)
  declare profile: BelongsTo<typeof Profile>

  @beforeSave()
  static async hashPassword(student: Student) {
    if (student.$dirty.password) {
      student.password = await hash.make(student.password)
    }
  }

  currentAccessToken?: AccessToken
  static accessTokens = DbAccessTokensProvider.forModel(Student, {
    table: 'access_tokens_students',
    expiresIn: '30 days',
    prefix: 'oat_',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  @hasManyThrough([() => Graduation, () => GraduationStudent], {
    localKey: 'id',
    throughForeignKey: 'id',
  })
  declare graduations: HasManyThrough<typeof Graduation>
}
