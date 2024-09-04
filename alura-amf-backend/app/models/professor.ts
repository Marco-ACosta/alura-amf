import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Profile from '#models/profile'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})
export default class Professor extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare profileId: string

  @column()
  declare cpf: string

  @column()
  declare lattes: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @belongsTo(() => Profile)
  declare profile: BelongsTo<typeof Profile>

  currentAccessToken?: AccessToken
  static accessTokens = DbAccessTokensProvider.forModel(Professor, {
    table: 'access_tokens_professors',
    expiresIn: '30 days',
    prefix: 'oat_',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
