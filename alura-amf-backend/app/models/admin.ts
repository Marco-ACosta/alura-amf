import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Profile from '#models/profile'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { AccessToken } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class Admin extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare cpf: string

  @column()
  declare profileId: string

  @column()
  declare verificationCode?: string | null

  @belongsTo(() => Profile)
  declare profile: BelongsTo<typeof Profile>

  currentAccessToken?: AccessToken
  static accessTokens = DbAccessTokensProvider.forModel(Admin, {
    table: 'access_tokens_admins',
    expiresIn: '30 days',
    prefix: 'oat_',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
