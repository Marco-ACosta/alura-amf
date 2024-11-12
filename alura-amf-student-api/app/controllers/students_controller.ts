import {
  changePasswordValidator,
  forgotPassword,
  loginValidator,
  setPasswordValidator,
  updateStudentValidator,
} from '#validators/student'
import { inject } from '@adonisjs/core'
import CustomException from '#exceptions/custom_exception'
import type { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'
import StudentService from '#services/student_service'
import hash from '@adonisjs/core/services/hash'

@inject()
export default class UserController {
  constructor(protected studentService: StudentService) {}

  async update({ request, response, params }: HttpContext): Promise<void> {
    const id = params.id
    const student = await request.validateUsing(updateStudentValidator)
    await this.studentService.Update({ ...student, id })
    response.json({ success: [{ message: 'Estudante atualizado com sucesso', status: 201 }] })
  }

  async get({ params }: HttpContext): Promise<Student | null> {
    const { id } = params
    const student = await this.studentService.Get(id)
    if (!student) throw new CustomException(404, 'Estudante não encontrado.')
    return student
  }

  async login({ request }: HttpContext) {
    const dataAuth = await request.validateUsing(loginValidator)

    const student = await Student.verifyCredentials(dataAuth.email, dataAuth.password)
    const token = await Student.accessTokens.create(student)

    const data = {
      token: token.value?.release(),
      userId: student.id,
      type: 'bearer',
      abilities: token.abilities,
      expiresAt: token.expiresAt,
    }
    return { data }
  }

  async logout({ auth }: HttpContext) {
    const student = await auth.authenticate()
    await this.studentService.LogOut(student)

    return { success: [{ message: 'Logout realizado com sucesso', status: 200 }] }
  }

  async setPassword({ params, request, response }: HttpContext) {
    const { id, code } = params
    const data = await request.validateUsing(setPasswordValidator)
    const student = await this.studentService.Get(id)
    if (!student) throw new CustomException(404, 'Estudante não encontrado.')

    if (student.verificationCode !== code) {
      throw new CustomException(400, 'Código de verificação inválido.')
    }

    await this.studentService.SetStudentPassword(student, { verificationCode: null, ...data })

    return response.ok({ success: [{ message: 'Senha atualizada com sucesso', status: 200 }] })
  }

  async updatePassword({ params, request, response }: HttpContext) {
    const { id } = params
    const data = await request.validateUsing(changePasswordValidator)
    const student = await this.studentService.Get(id)

    if (!student) throw new CustomException(404, 'Estudante não encontrado.')

    if (!(await hash.verify(student.password, data.oldPassword))) {
      throw new CustomException(400, 'Senha não coincide com a atual.')
    }

    this.studentService.SetStudentPassword(student, { password: data.newPassword })
    return response.ok({ success: [{ message: 'Senha atualizada com sucesso', status: 200 }] })
  }

  async forgotPassword({ request, response }: HttpContext) {
    const data = await request.validateUsing(forgotPassword)
    const student = await this.studentService.Get(data.email, 'email')

    if (!student) throw new CustomException(404, 'Estudante nao encontrado.')

    await this.studentService.UpdateVerificationCode(student.id)
    await this.studentService.SendStudentForgotPasswordEmail(
      data.email,
      student.profile.name,
      student.verificationCode!,
      student.id
    )

    await this.studentService.TerminateAllSessions(student)
    return response.ok({ success: [{ message: 'Email enviado com sucesso.', status: 200 }] })
  }
}
