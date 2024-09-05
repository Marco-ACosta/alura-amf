import Admin from '#models/admin'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import {
  ChangeAdminInfoType,
  ChangePasswordType,
  CreateAdminType,
  StoreAdminType,
  UpdateAdminType,
  VerificationCodeType,
} from '../utils/types.js'
import profile_service from './profile_service.js'
import db from '@adonisjs/lucid/services/db'
import { getUnixTime } from 'date-fns'
import helpers from '../utils/helpers.js'
import { AdminEmailSubjects } from '../utils/consts.js'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'

export default {
  /**
   * Creates a new admin user and associated profile.
   *
   * @param data - The data to create the admin user.
   * @param data.name - The name of the user.
   * @param data.lastName - The last name of the user.
   * @param data.phone - The phone number of the user.
   * @param data.type - The type of the user.
   * @param data.email - The email of the user.
   * @param data.password - The password of the user.
   * @param data.cpf - The CPF of the user.
   *
   * @returns The created admin user and its associated profile.
   */
  async CreateAdmin(data: CreateAdminType) {
    const profile = await profile_service.CreateProfile(
      data.name,
      data.lastName,
      data.phone,
      data.type
    )
    const adminData: StoreAdminType = {
      email: data.email,
      cpf: data.cpf,
      profileId: profile.id,
      verificationCode: helpers.getValidationCode(),
    }

    const admin = await this.StoreAdmin(adminData)
    return { admin, profile }
  },

  /**
   * Stores a new admin user in the database.
   *
   * @param adminData - The data to store the admin user.
   * @param adminData.email - The email of the user.
   * @param adminData.password - The password of the user.
   * @param adminData.cpf - The CPF of the user.
   * @param adminData.profileId - The ID of the associated profile.
   *
   * @returns The created admin user.
   */
  async StoreAdmin(adminData: StoreAdminType) {
    return await db.transaction(async (trx) => {
      return await Admin.create(adminData, { client: trx })
    })
  },

  async ListAdmins(
    page: number = 1,
    limit: number = 10,
    column: string,
    direction: 'asc' | 'desc',
    search?: string,
    isActive?: boolean
  ) {
    const admins = await Admin.query()
      .whereHas('profile', (query) => query.where('isActive', true).andWhereNull('deletedAt'))
      .preload('profile')
      .join('profiles', 'admins.profile_id', 'profiles.id')
      .select(
        'admins.id',
        'profiles.name',
        'profiles.last_name',
        'admins.email',
        'profiles.is_active',
        'admins.profile_id'
      )
      .if(search, (query) =>
        query.where('name', 'like', `%${search}%`).orWhere('lastName', 'like', `%${search}%`)
      )
      .if(column === 'email', (query) => query.orderBy(column, direction))
      .if(column === 'name' || column === 'isActive', (query) =>
        query.orderBy(`profiles.${column}`, direction)
      )
      .if(isActive, (query) => query.where('profile.isActive', isActive!))
      .paginate(page, limit)

    const { data, meta } = admins.serialize()
    return {
      meta,
      data: data.map((admin) => ({
        id: admin.id,
        name: admin.profile.name + ' ' + admin.profile.lastName,
        email: admin.email,
        isActive: admin.profile.isActive,
      })),
    }
  },

  async GetAdmin(id: string) {
    return await Admin.query().where('id', id).preload('profile').firstOrFail()
  },

  async GetAdminByEmail(email: string) {
    const admin = await Admin.query().where('email', email).preload('profile').firstOrFail()
    return admin
  },

  async ShowAdmin(id: string) {
    const admin = await this.GetAdmin(id)
    return {
      id: admin.id,
      name: admin.profile.name + ' ' + admin.profile.lastName,
      email: admin.email,
      cpf: admin.cpf,
      phone: admin.profile.phone,
      isActive: admin.profile.isActive,
    }
  },

  async GetAdminProfile(admin: Admin) {
    const profile = await admin.related('profile').query().firstOrFail()
    return profile
  },

  async UpdateAdmin(id: string, data: UpdateAdminType) {
    const admin = await this.GetAdmin(id)

    const dataAdmin = {
      email: data.email,
      cpf: data.cpf,
    }

    const dataProfile = {
      name: data.name,
      lastName: data.lastName,
      phone: data.phone,
    }

    await db.transaction(async (trx) => {
      await this.SaveAdmin(admin.id, dataAdmin, trx)
      await profile_service.UpdateProfile(admin.profileId, dataProfile, trx)
    })
    return admin
  },

  async SaveAdmin(
    id: string,
    data: ChangeAdminInfoType | ChangePasswordType | VerificationCodeType,
    trx: TransactionClientContract
  ) {
    await Admin.updateOrCreate({ id: id }, { ...data }, { client: trx })
  },

  async DeleteAdmin(id: string) {
    const admin = await this.GetAdmin(id)
    const deletedAt = getUnixTime(new Date())
    const isActive = false
    await db.transaction(async (trx) => {
      await profile_service.UpdateProfile(admin.profileId, { isActive, deletedAt }, trx)
    })
  },

  async DestroyAdmin(id: string) {
    await db.transaction(async (trx) => {
      const admin = await this.GetAdmin(id)
      console.log(admin)
      await profile_service.DestroyProfile(admin.profileId, trx)
      await Admin.query({ client: trx }).where('id', id).delete()
    })
  },

  async RestoreAdmin(id: string) {
    await db.transaction(async (trx) => {
      const admin = await this.GetAdmin(id)
      const deletedAt = null
      const isActive = true
      await profile_service.UpdateProfile(admin.profileId, { isActive, deletedAt }, trx)
    })
  },

  async SendAdminConfirmationEmail(
    email: string,
    name: string,
    code: string,
    id: string
  ): Promise<void> {
    const filePath = app.makePath('emails', 'admin-confirmation-email.html')
    const fileContent = await fs.promises.readFile(filePath, 'utf8')
    const url = `http://localhost:3333/api/admin/${id}/set-password/${code}`
    const emailContent = fileContent.replace('{{name}}', name).replace('{{url}}', url)
    await helpers.sendEmail(email, AdminEmailSubjects.ADMIN_CONFIRMATION_EMAIL, emailContent)
  },

  async SendAdminForgotPasswordEmail(
    email: string,
    name: string,
    code: string,
    id: string
  ): Promise<void> {
    const filePath = app.makePath('emails', 'admin-forgot-password-email.html')
    const fileContent = await fs.promises.readFile(filePath, 'utf8')
    const url = `http://localhost:3333/api/admin/${id}/set-password/${code}`
    const emailContent = fileContent.replace('{{name}}', name).replace('{{url}}', url)
    await helpers.sendEmail(email, AdminEmailSubjects.ADMIN_FORGOT_PASSWORD_EMAIL, emailContent)
  },

  async SetAdminPassword(adminId: string, data: ChangePasswordType) {
    await db.transaction(async (trx) => {
      await this.SaveAdmin(adminId, data, trx)
    })
  },

  async UpdateValidationCode(adminId: string) {
    await db.transaction(async (trx) => {
      const code = helpers.getValidationCode()
      await this.SaveAdmin(adminId, { verificationCode: code }, trx)
    })
  },

  async LogOutAdmin(admin: Admin) {
    await db.transaction(async () => {
      const tokens = await Admin.accessTokens.all(admin)
      tokens.map(async (token) => {
        await Admin.accessTokens.delete(admin, token.identifier)
      })
    })
  },

  async TerminateAdminSession(admin: Admin) {
    await db.transaction(async () => {
      Admin.accessTokens.delete(admin, admin.currentAccessToken!.identifier)
    })
  },
}
