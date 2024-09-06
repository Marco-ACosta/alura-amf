import db from '@adonisjs/lucid/services/db'
import {
  ChangePasswordType,
  ChangeStudentInfoType,
  CreateStudentType,
  StoreStudentType,
  UpdateStudentType,
  VerificationCodeType,
} from '../utils/types.js'
import Student from '#models/student'
import profile_service from '#services/profile_service'
import { getUnixTime } from 'date-fns'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import app from '@adonisjs/core/services/app'
import helpers from '../utils/helpers.js'
import { StudentEmailSubjects } from '../utils/consts.js'
import fs from 'node:fs'

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

  async TerminateStudentSession(student: Student) {
    await db.transaction(async () => {
      Student.accessTokens.delete(student, student.currentAccessToken!.identifier)
    })
  },

  async ListStudent(
    search: string,
    column: string,
    direction: 'asc' | 'desc',
    page: number,
    limit: number,
    isActive?: boolean
  ) {
    const students = await Student.query()
      .whereHas('profile', (query) => query.whereNull('deletedAt'))
      .preload('profile')
      .join('profiles', 'students.profile_id', 'profiles.id')
      .select(
        'students.id',
        'profiles.name',
        'profiles.last_name',
        'profiles.is_active',
        'students.email',
        'students.academic_register',
        'students.profile_id'
      )
      .if(search, (query) =>
        query
          .where('profiles.name', 'like', `%${search}%`)
          .orWhere('profiles.last_name', 'like', `%${search}%`)
      )
      .if(column === 'name' || column === 'isActive', (query) =>
        query.orderBy(`profiles.${column}`, direction)
      )
      .if(column === 'email' || column === 'academicRegister', (query) =>
        query.orderBy(column, direction)
      )
      .if(isActive, (query) => query.where('profile.isActive', isActive!))
      .paginate(page, limit)

    const { data, meta } = students.serialize()

    return {
      meta,
      data: data.map((student) => ({
        id: student.id,
        name: student.name + ' ' + student.lastName,
        email: student.email,
        academicRegister: student.academic_register,
        isActive: student.is_active,
      })),
    }
  },

  async ShowStudent(id: string) {
    const student = await this.GetStudent(id)
    return {
      id: student.id,
      name: student.profile.name + ' ' + student.profile.lastName,
      email: student.email,
      academicRegister: student.academicRegister,
      cpf: student.cpf,
      phone: student.profile.phone,
      isActive: student.profile.isActive,
    }
  },

  async UpdateStudent(id: string, data: UpdateStudentType) {
    const student = await this.GetStudent(id)

    const studentData = {
      email: data.email,
      academicRegister: data.academicRegister,
      cpf: data.cpf,
    }

    const dataProfile = {
      name: data.name,
      lastName: data.lastName,
      phone: data.phone,
    }

    await db.transaction(async (trx) => {
      await this.SaveStudent(studentData, id, trx)
      await profile_service.UpdateProfile(student.profileId, dataProfile, trx)
    })
    return student
  },

  async SaveStudent(
    data: UpdateStudentType | ChangeStudentInfoType | ChangePasswordType | VerificationCodeType,
    id: string,
    trx: TransactionClientContract
  ) {
    await Student.updateOrCreate({ id: id }, { ...data }, { client: trx })
  },

  async SetStudentPassword(id: string, data: ChangePasswordType) {
    await db.transaction(async (trx) => {
      await this.SaveStudent(data, id, trx)
    })
  },

  async GetStudentByEmail(email: string) {
    return await Student.query().where('email', email).firstOrFail()
  },

  async SendStudentForgotPasswordEmail(email: string, name: string, code: string, id: string) {
    const filePath = app.makePath('emails', 'student-forgot-password-email.html')
    const fileContent = await fs.promises.readFile(filePath, 'utf8')
    const url = `http://localhost:3333/api/professor/${id}/set-password/${code}`
    const emailContent = fileContent.replace('{{name}}', name).replace('{{url}}', url)
    await helpers.sendEmail(email, StudentEmailSubjects.STUDENT_FORGOT_PASSWORD_EMAIL, emailContent)
  },

  async SendStudentConfirmationEmail(email: string, name: string, code: string, id: string) {
    const filePath = app.makePath('emails', 'student-confirmation-email.html')
    const fileContent = await fs.promises.readFile(filePath, 'utf8')
    const url = `http://localhost:3333/api/professor/${id}/set-password/${code}`
    const emailContent = fileContent.replace('{{name}}', name).replace('{{url}}', url)
    await helpers.sendEmail(email, StudentEmailSubjects.STUDENT_CONFIRMATION_EMAIL, emailContent)
  },

  async UpdateVerificationCode(id: string) {
    await db.transaction(async (trx) => {
      const code = helpers.getValidationCode()
      await this.SaveStudent({ verificationCode: code }, id, trx)
    })
  },

  async LogOutStudent(student: Student) {
    await db.transaction(async () => {
      const tokens = await Student.accessTokens.all(student)
      tokens.map(async (token) => {
        await Student.accessTokens.delete(student, token.identifier)
      })
    })
  },
}
