import db from '@adonisjs/lucid/services/db'
import { CreateStudentType, StoreStudentType } from '../utils/types.js'
import Student from '#models/student'
import profile_service from '#services/profile_service'
import { getUnixTime } from 'date-fns'

export default {
  async CreateStudent(data: CreateStudentType) {
    const profile = await profile_service.CreateProfile(
      data.name,
      data.lastName,
      data.phone,
      data.type
    )

    const studentData = {
      email: data.email,
      password: data.password,
      academicRegister: data.academicRegister,
      cpf: data.cpf,
      profileId: profile.id,
    }

    const student = await this.StoreStudent(studentData)
    return { student, profile }
  },

  async StoreStudent(data: StoreStudentType) {
    return await db.transaction(async (trx) => {
      return await Student.create(data, { client: trx })
    })
  },

  async GetStudent(id: string) {
    return await Student.query().where('id', id).preload('profile').firstOrFail()
  },

  async DeleteStudent(id: string) {
    const student = await this.GetStudent(id)
    const deletedAt = getUnixTime(new Date())
    const isActive = false
    await db.transaction(async (trx) => {
      await profile_service.UpdateProfile(student.profileId, { isActive, deletedAt }, trx)
    })
  },

  async DestroyStudent(id: string) {
    await db.transaction(async (trx) => {
      const student = await this.GetStudent(id)
      await profile_service.DestroyProfile(student.profileId, trx)
      await Student.query({ client: trx }).where('id', id).delete()
    })
  },

  async RestoreStudent(id: string) {
    await db.transaction(async (trx) => {
      const student = await this.GetStudent(id)
      const deletedAt = null
      const isActive = true
      await profile_service.UpdateProfile(student.profileId, { isActive, deletedAt }, trx)
    })
  },
}
