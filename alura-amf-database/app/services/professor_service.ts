import db from '@adonisjs/lucid/services/db'
import {
  ChangePasswordType,
  ChangeProfessorInfoType,
  CreateProfessorType,
  StoreProfessorType,
  UpdateProfessorType,
  VerificationCodeType,
} from '../utils/types.js'
import Professor from '#models/professor'
import profile_service from './profile_service.js'
import { getUnixTime } from 'date-fns'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import helpers from '../utils/helpers.js'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'
import { ProfessorEmailSubjects } from '../utils/consts.js'

export default {
  async CreateProfessor(data: CreateProfessorType) {
    const profile = await profile_service.CreateProfile(
      data.name,
      data.lastName,
      data.phone,
      data.type
    )

    const professorData = {
      email: data.email,
      cpf: data.cpf,
      lattes: data.lattes,
      profileId: profile.id,
      verificationCode: helpers.getValidationCode(),
    }

    const professor = await this.StoreProfessor(professorData)
    return { professor, profile }
  },
  async StoreProfessor(data: StoreProfessorType) {
    return await db.transaction(async (trx) => await Professor.create(data, { client: trx }))
  },
  async GetProfessor(id: string) {
    return await Professor.query().where('id', id).preload('profile').firstOrFail()
  },
  async DeleteProfessor(id: string) {
    const professor = await this.GetProfessor(id)
    const deletedAt = getUnixTime(new Date())
    const isActive = false
    await db.transaction(
      async (trx) =>
        await profile_service.UpdateProfile(professor.profileId, { isActive, deletedAt }, trx)
    )
  },

  async DestroyProfessor(id: string) {
    const professor = await this.GetProfessor(id)
    await db.transaction(async (trx) => {
      await profile_service.DestroyProfile(professor.profileId, trx)
      await Professor.query({ client: trx }).where('id', id).delete()
    })
  },

  async RestoreProfessor(id: string) {
    const professor = await this.GetProfessor(id)
    const deletedAt = null
    const isActive = true
    await db.transaction(
      async (trx) =>
        await profile_service.UpdateProfile(professor.profileId, { isActive, deletedAt }, trx)
    )
  },

  async ListProfessor(
    page: number,
    limit: number,
    column: string,
    direction: 'asc' | 'desc',
    search?: string,
    isActive?: boolean
  ) {
    const professors = await Professor.query()
      .whereHas('profile', (query) => query.whereNull('deletedAt'))
      .preload('profile')
      .join('profiles', 'professors.profile_id', 'profiles.id')
      .select(
        'professors.id',
        'profiles.name',
        'profiles.last_name',
        'profiles.is_active',
        'professors.email',
        'professors.lattes',
        'professors.profile_id'
      )
      .if(search, (query) =>
        query
          .where('profiles.name', 'like', `%${search}%`)
          .orWhere('profiles.last_name', 'like', `%${search}%`)
      )
      .if(column === 'name' || column === 'isActive', (query) =>
        query.orderBy(`profiles.${column}`, direction)
      )
      .if(column === 'email' || column === 'lattes', (query) => query.orderBy(column, direction))
      .if(isActive, (query) => query.where('profile.isActive', isActive!))
      .paginate(page, limit)

    const { data, meta } = professors.serialize()

    return {
      meta,
      data: data.map((professor) => ({
        id: professor.id,
        name: professor.profile.name + ' ' + professor.profile.lastName,
        email: professor.email,
        lattes: professor.lattes,
        isActive: professor.profile.isActive,
      })),
    }
  },

  async TerminateProfessorSession(professor: Professor) {
    await db.transaction(async () =>
      Professor.accessTokens.delete(professor, professor.currentAccessToken!.identifier)
    )
  },

  async ShowProfessor(id: string) {
    const professor = await this.GetProfessor(id)
    return {
      id: professor.id,
      name: professor.profile.name + ' ' + professor.profile.lastName,
      email: professor.email,
      lattes: professor.lattes,
      cpf: professor.cpf,
      isActive: professor.profile.isActive,
      phone: professor.profile.phone,
    }
  },

  async UpdateProfessor(id: string, data: UpdateProfessorType) {
    const professor = await this.GetProfessor(id)

    const professorData = {
      email: data.email,
      lattes: data.lattes,
      cpf: data.cpf,
    }

    const dataProfile = {
      name: data.name,
      lastName: data.lastName,
      phone: data.phone,
    }
    await db.transaction(async (trx) => {
      await this.SaveProfessor(professorData, id, trx)
      await profile_service.UpdateProfile(professor.profileId, dataProfile, trx)
    })
    return professor
  },

  async SaveProfessor(
    data:
      | CreateProfessorType
      | UpdateProfessorType
      | ChangeProfessorInfoType
      | ChangePasswordType
      | VerificationCodeType,
    id: string,
    trx: TransactionClientContract
  ) {
    await Professor.updateOrCreate({ id: id }, { ...data }, { client: trx })
  },

  async SetProfessorPassword(id: string, data: ChangePasswordType) {
    await db.transaction(async (trx) => await this.SaveProfessor(data, id, trx))
  },

  async GetProfessorByEmail(email: string) {
    return await Professor.query().where('email', email).preload('profile').firstOrFail()
  },

  async UpdateVerificationCode(id: string) {
    const code = helpers.getValidationCode()
    await db.transaction(
      async (trx) => await this.SaveProfessor({ verificationCode: code }, id, trx)
    )
  },

  async LogOutProfessor(professor: Professor) {
    await db.transaction(async () => {
      const tokens = await Professor.accessTokens.all(professor)
      tokens.map(async (token) => {
        await Professor.accessTokens.delete(professor, token.identifier)
      })
    })
  },

  async SendProfessorForgotPasswordEmail(email: string, name: string, code: string, id: string) {
    const filePath = app.makePath('emails', 'professor-forgot-password-email.html')
    const fileContent = await fs.promises.readFile(filePath, 'utf8')
    const url = `http://localhost:3333/api/professor/${id}/set-password/${code}`
    const emailContent = fileContent.replace('{{name}}', name).replace('{{url}}', url)
    await helpers.sendEmail(
      email,
      ProfessorEmailSubjects.PROFESSOR_FORGOT_PASSWORD_EMAIL,
      emailContent
    )
  },

  async SendProfessorConfirmationEmail(email: string, name: string, code: string, id: string) {
    const filePath = app.makePath('emails', 'professor-confirmation-email.html')
    const fileContent = await fs.promises.readFile(filePath, 'utf8')
    const url = `http://localhost:3333/api/professor/${id}/set-password/${code}`
    const emailContent = fileContent.replace('{{name}}', name).replace('{{url}}', url)
    await helpers.sendEmail(
      email,
      ProfessorEmailSubjects.PROFESSOR_CONFIRMATION_EMAIL,
      emailContent
    )
  },
}
