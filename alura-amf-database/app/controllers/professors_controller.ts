import Professor from '#models/professor'
import professor_service from '#services/professor_service'
import { changePasswordValidator, loginValidator, setPasswordValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { PaginationDefault } from '../utils/consts.js'
import { professorUpdateValidator } from '#validators/professor'
import hash from '@adonisjs/core/services/hash'
import { forgotPassword } from '#validators/admin'

export default class ProfessorsController {
  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const professor = await Professor.verifyCredentials(email, password)
    const token = await Professor.accessTokens.create(professor)
    return token
  }

  async logout({ auth, response }: HttpContext) {
    const professor = (await auth.authenticateUsing(['professorAuth'])) as Professor
    await professor_service.TerminateProfessorSession(professor)
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
    return await professor_service.ListProfessor(page, limit, column, direction, search, isActive)
  }

  async show({ params }: HttpContext) {
    const { id } = params
    return await professor_service.ShowProfessor(id)
  }

  async update({ params, request }: HttpContext) {
    const { id } = params
    const data = await request.validateUsing(professorUpdateValidator)
    await professor_service.UpdateProfessor(id, data)
    return { success: [{ message: 'Dados atualizados com sucesso.', status: 200 }] }
  }

  async setPassword({ params, request, response }: HttpContext) {
    const { id, code } = params
    const data = await request.validateUsing(setPasswordValidator)
    const professor = await professor_service.GetProfessor(id)
    if (professor.verificationCode !== code) {
      return response.badRequest({
        errors: [{ message: 'Código de verificação inválido.', status: 400 }],
      })
    }

    professor_service.SetProfessorPassword(professor.id, { ...data, verificationCode: null })
    return response.ok({ success: [{ message: 'Senha atualizada com sucesso', status: 200 }] })
  }

  async updatePassword({ params, request, response }: HttpContext) {
    const { id } = params
    const data = await request.validateUsing(changePasswordValidator)
    const professor = await professor_service.GetProfessor(id)

    if (!(await hash.verify(professor.password, data.oldPassword))) {
      return response.badRequest({
        errors: [{ message: 'Senha não coincide com a atual.', status: 400 }],
      })
    }

    await professor_service.SetProfessorPassword(professor.id, { password: data.newPassword })
    return response.ok({ success: [{ message: 'Senha atualizada com sucesso', status: 200 }] })
  }

  async forgotPassword({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPassword)
    const professor = await professor_service.GetProfessorByEmail(email)
    await professor_service.UpdateVerificationCode(professor.id)
    await professor_service.SendProfessorForgotPasswordEmail(
      email,
      professor.profile.name,
      professor.verificationCode!,
      professor.id
    )
    await professor_service.LogOutProfessor(professor)
    return response.ok({ success: [{ message: 'Email enviado com sucesso.', status: 200 }] })
  }
}
