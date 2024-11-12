import { AccessToken } from '@adonisjs/auth/access_tokens'
import { ChangePasswordType, CreateStudentProps, UpdateStudentProps } from '../types/student.js'
import { Pagination } from '../types/pagination.js'
import CustomException from '#exceptions/custom_exception'
import db from '@adonisjs/lucid/services/db'
import IStudentService from '../interfaces/student.js'
import Student from '#models/student'
import Profile from '#models/profile'
import helpers from '../utils/helpers.js'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'
import { StudentEmailSubjects } from '../utils/constants.js'

export default class StudentService implements IStudentService {
  async SetStudentPassword(student: Student, data: ChangePasswordType): Promise<void> {
    await student.merge({ ...data }).save()
  }
  async LogOut(student: Student): Promise<void> {
    await Student.accessTokens.delete(student, student.currentAccessToken!.identifier)
  }

  async TerminateAllSessions(student: Student): Promise<void> {
    await db.transaction(async () => {
      const tokens = await Student.accessTokens.all(student)
      tokens.map(async (token) => {
        await Student.accessTokens.delete(student, token.identifier)
      })
    })
  }

  async Create(createProps: CreateStudentProps, validate = true): Promise<Student> {
    return await db.transaction(async (trx) => {
      if (validate) await this.Validate(createProps)
      return await Student.create(createProps, { client: trx })
    })
  }

  async Update(updateProps: UpdateStudentProps, validate = true): Promise<Student> {
    const student = await this.Get(updateProps.id)
    console.log(student)
    if (!student) throw new CustomException(404, 'Usuário não encontrado.')
    const profileData = {
      name: updateProps.name,
      lastName: updateProps.lastName,
      phone: updateProps.phone,
    }

    const studentData = {
      email: updateProps.email,
      academicRegister: updateProps.academicRegister,
      cpf: updateProps.cpf,
    }

    return await db.transaction(async (trx) => {
      if (validate) await this.Validate(updateProps)
      await Profile.query({ client: trx })
        .where('id', student.profileId)
        .update({ ...profileData })
      return await student.merge({ ...studentData }).save({ client: trx })
    })
  }

  async Validate(_: CreateStudentProps): Promise<void> {}

  async Get(param: string, column: string = 'id'): Promise<Student | null> {
    return await Student.query()
      .where(column, param)
      .preload('profile')
      .preload('graduations')
      .first()
  }

  async Delete(id: string): Promise<void> {
    const user = await this.Get(id)
    if (!user) throw new CustomException(404, 'Usuário não encontrado.')
    await user.delete()
  }

  async List({ page, limit, orderBy, orderByDirection }: Pagination) {
    return await Student.query().orderBy(orderBy, orderByDirection).paginate(page, limit)
  }

  async Login(email: string, password: string): Promise<AccessToken> {
    const student = await Student.verifyCredentials(email, password)
    const token = await Student.accessTokens.create(student, ['*'], { expiresIn: 'never' })
    return token
  }

  async UpdateVerificationCode(id: string) {
    const code = helpers.getValidationCode()
    await Student.query().where('id', id).update({ verificationCode: code })
  }

  async SendStudentForgotPasswordEmail(email: string, name: string, code: string, id: string) {
    const filePath = app.makePath('emails', 'student-forgot-password-email.html')
    const fileContent = await fs.promises.readFile(filePath, 'utf8')
    const url = `http://localhost:3333/api/student/${id}/set-password/${code}`
    const emailContent = fileContent.replace('{{name}}', name).replace('{{url}}', url)
    await helpers.sendEmail(email, StudentEmailSubjects.STUDENT_FORGOT_PASSWORD_EMAIL, emailContent)
  }
}
