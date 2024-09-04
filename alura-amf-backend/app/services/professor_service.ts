import db from '@adonisjs/lucid/services/db'
import {
  ChangeProfessorInfoType,
  CreateProfessorType,
  StoreProfessorType,
  UpdateProfessorType,
} from '../utils/types.js'
import Professor from '#models/professor'
import profile_service from './profile_service.js'
import { getUnixTime } from 'date-fns'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

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
      password: data.password,
      cpf: data.cpf,
      lattes: data.lattes,
      profileId: profile.id,
    }

    const professor = await this.StoreProfessor(professorData)
    return { professor, profile }
  },
  async StoreProfessor(data: StoreProfessorType) {
    return await db.transaction(async (trx) => {
      return await Professor.create(data, { client: trx })
    })
  },
  async GetProfessor(id: string) {
    return await Professor.query().where('id', id).preload('profile').firstOrFail()
  },
  async DeleteProfessor(id: string) {
    const professor = await this.GetProfessor(id)
    const deletedAt = getUnixTime(new Date())
    const isActive = false
    await db.transaction(async (trx) => {
      await profile_service.UpdateProfile(professor.profileId, { isActive, deletedAt }, trx)
    })
  },

  async DestroyProfessor(id: string) {
    await db.transaction(async (trx) => {
      const professor = await this.GetProfessor(id)
      await profile_service.DestroyProfile(professor.profileId, trx)
      await Professor.query({ client: trx }).where('id', id).delete()
    })
  },

  async RestoreProfessor(id: string) {
    await db.transaction(async (trx) => {
      const professor = await this.GetProfessor(id)
      const deletedAt = null
      const isActive = true
      await profile_service.UpdateProfile(professor.profileId, { isActive, deletedAt }, trx)
    })
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
      .whereHas('profile', (query) => query.where('isActive', true).andWhereNull('deletedAt'))
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
        query.where('name', 'like', `%${search}%`).orWhere('lastName', 'like', `%${search}%`)
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
    await db.transaction(async () => {
      Professor.accessTokens.delete(professor, professor.currentAccessToken!.identifier)
    })
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
  },

  async SaveProfessor(
    data: CreateProfessorType | UpdateProfessorType | ChangeProfessorInfoType,
    id: string,
    trx: TransactionClientContract
  ) {
    await Professor.updateOrCreate({ id: id }, { ...data }, { client: trx })
  },
}
