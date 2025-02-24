import Profile from '#models/profile'
import db from '@adonisjs/lucid/services/db'
import { ChangeProfileInfoType, DeleteUsersType, StoreProfileType } from '../utils/types.js'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default {
  async CreateProfile(
    name: string,
    lastName: string,
    phone: string,
    type: string
  ): Promise<Profile> {
    const profileData: StoreProfileType = { name, lastName, phone, type }
    const profile = await this.StoreProfile(profileData)
    return profile
  },

  async StoreProfile(profileData: StoreProfileType): Promise<Profile> {
    return await db.transaction(async (trx) => await Profile.create(profileData, { client: trx }))
  },

  async UpdateProfile(
    id: string,
    data: ChangeProfileInfoType | DeleteUsersType,
    trx: TransactionClientContract
  ) {
    await Profile.updateOrCreate({ id: id }, { ...data }, { client: trx })
  },

  async DestroyProfile(id: string, trx: TransactionClientContract) {
    await Profile.query({ client: trx }).where('id', id).delete()
  },
}
