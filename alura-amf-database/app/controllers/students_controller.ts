import Student from '#models/student'
import student_service from '#services/student_service'
import { changePasswordValidator, loginValidator, setPasswordValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { PaginationDefault } from '../utils/consts.js'
import { studentUpdateValidator } from '#validators/student'
import hash from '@adonisjs/core/services/hash'
import { forgotPassword } from '#validators/admin'

export default class StudentsController {
  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const student = await Student.verifyCredentials(email, password)
    const token = await Student.accessTokens.create(student)
    return token
  }

  async logout({ auth, response }: HttpContext) {
    const student = (await auth.authenticateUsing(['studentAuth'])) as Student
    await student_service.TerminateStudentSession(student)
    return response.ok({
      success: [{ message: 'Logout realizado com sucesso.', status: 200 }],
    })
  }

  async list({ request }: HttpContext) {
    const qs = request.qs()
    const { page = PaginationDefault.page, limit = PaginationDefault.limit } = qs
    const { column = 'name', direction = 'asc' } = qs
    const { search } = qs
    const { isActive } = qs
    return await student_service.ListStudent(column, direction, page, limit, isActive, search)
  }

  async show({ params }: HttpContext) {
    const { id } = params
    return await student_service.ShowStudent(id)
  }

  async update({ params, request }: HttpContext) {
    const { id } = params
    const data = await request.validateUsing(studentUpdateValidator)
    await student_service.UpdateStudent(id, data)
    return { success: [{ message: 'Dados atualizados com sucesso.', status: 200 }] }
  }

  async setPassword({ params, request, response }: HttpContext) {
    const { id, code } = params
    const data = await request.validateUsing(setPasswordValidator)
    const student = await student_service.GetStudent(id)
    if (student.verificationCode !== code) {
      return response.badRequest({
        errors: [{ message: 'Código de verificação inválido.', status: 400 }],
      })
    }

    student_service.SetStudentPassword(student.id, { ...data, verificationCode: null })
    return response.ok({ success: [{ message: 'Senha atualizada com sucesso', status: 200 }] })
  }

  async updatePassword({ params, request, response }: HttpContext) {
    const { id } = params
    const data = await request.validateUsing(changePasswordValidator)
    const student = await student_service.GetStudent(id)

    if (!(await hash.verify(student.password, data.oldPassword))) {
      return response.badRequest({
        errors: [{ message: 'Senha não coincide com a atual.', status: 400 }],
      })
    }

    await student_service.SetStudentPassword(student.id, { password: data.newPassword })
    return response.ok({ success: [{ message: 'Senha atualizada com sucesso', status: 200 }] })
  }

  async forgotPassword({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPassword)
    const student = await student_service.GetStudentByEmail(email)
    await student_service.UpdateVerificationCode(student.id)
    await student_service.SendStudentForgotPasswordEmail(
      email,
      student.profile.name,
      student.verificationCode!,
      student.id
    )
    await student_service.LogOutStudent(student)
    return response.ok({ success: [{ message: 'Email enviado com sucesso.', status: 200 }] })
  }
}
