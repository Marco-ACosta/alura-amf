import type { HttpContext } from '@adonisjs/core/http'
import Admin from '#models/admin'
import { changePasswordValidator, loginValidator, setPasswordValidator } from '#validators/auth'
import { adminStoreValidator, adminUpdateValidator, forgotPassword } from '#validators/admin'
import admin_service from '#services/admin_service'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import { professorStoreValidator } from '#validators/professor'
import { studentStoreValidator } from '#validators/student'
import professor_service from '#services/professor_service'
import student_service from '#services/student_service'
import { PaginationDefault } from '../utils/consts.js'
import hash from '@adonisjs/core/services/hash'

export default class AdminController {
  /**
   * Handle login request to the API.
   *
   * @param {HttpContext} ctx
   * @returns {Promise<Object>}
   */
  async login({ request }: HttpContext): Promise<AccessToken> {
    const { email, password } = await request.validateUsing(loginValidator)
    const admin = await Admin.verifyCredentials(email, password)
    const token = await Admin.accessTokens.create(admin)
    return token
  }

  /**
   * Handle logout request to the API.
   *
   * @param {HttpContext} ctx
   * @returns {Promise<Object>}
   */
  async logout({ auth, response }: HttpContext) {
    const admin = await auth.authenticateUsing(['adminAuth'])
    await admin_service.TerminateAdminSession(admin)
    return response.ok({
      success: [{ message: 'Logout realizado com sucesso.', status: 200 }],
    })
  }
  /*ADICIONAR MÉTODO PARA ENVIO DE EMAIL para professores e estudantes*/

  /**
   * Handle the creation of a new admin, student or professor.
   *
   * @param {HttpContext} ctx
   * @returns {Promise<Object>}
   */
  async store({ request, params, response }: HttpContext) {
    const { type } = params
    if (type === 'admin') {
      const data = await request.validateUsing(adminStoreValidator)
      const { admin } = await admin_service.CreateAdmin({ ...data, type })
      await admin_service.SendAdminConfirmationEmail(
        admin.email,
        data.name,
        admin.verificationCode!,
        admin.id
      )
      return response.ok({ success: [{ message: 'Admin criado com sucesso.', status: 200 }] })
    }

    if (type === 'professor') {
      const data = await request.validateUsing(professorStoreValidator)
      const { professor } = await professor_service.CreateProfessor({ ...data, type })
      await professor_service.SendProfessorConfirmationEmail(
        data.email,
        data.name,
        professor.verificationCode!,
        professor.id
      )
      return response.ok({ success: [{ message: 'Professor criado com sucesso.', status: 200 }] })
    }

    if (type === 'student') {
      const data = await request.validateUsing(studentStoreValidator)
      await student_service.CreateStudent({ ...data, type })
      return response.ok({ success: [{ message: 'Estudante criado com sucesso.', status: 200 }] })
    }
  }

  async list({ request }: HttpContext) {
    const qs = request.qs()
    const { page = PaginationDefault.page, limit = PaginationDefault.limit } = qs
    const { isActive } = qs
    const { search } = qs
    const { column = 'name', direction = 'asc' } = qs
    return await admin_service.ListAdmins(page, limit, column, direction, search, isActive)
  }

  async show({ params }: HttpContext) {
    const { id } = params
    return await admin_service.ShowAdmin(id)
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const data = await request.validateUsing(adminUpdateValidator)
    await admin_service.UpdateAdmin(id, data)
    return response.ok({ success: [{ message: 'Dados atualizados com sucesso.', status: 200 }] })
  }

  async setPassword({ params, request, response }: HttpContext) {
    const { id, code } = params
    const data = await request.validateUsing(setPasswordValidator)
    const admin = await admin_service.GetAdmin(id)
    if (admin.verificationCode !== code) {
      return response.badRequest({
        errors: [{ message: 'Código de verificação inválido.', status: 400 }],
      })
    }

    admin_service.SetAdminPassword(admin.id, { ...data, verificationCode: null })
    return response.ok({ success: [{ message: 'Senha atualizada com sucesso', status: 200 }] })
  }

  async updatePassword({ params, request, response }: HttpContext) {
    const { id } = params
    const data = await request.validateUsing(changePasswordValidator)
    const admin = await admin_service.GetAdmin(id)

    if (!(await hash.verify(admin.password, data.oldPassword))) {
      return response.badRequest({
        errors: [{ message: 'Senha não coincide com a atual.', status: 400 }],
      })
    }

    await admin_service.SetAdminPassword(admin.id, { password: data.newPassword })
    return response.ok({ success: [{ message: 'Senha atualizada com sucesso', status: 200 }] })
  }

  async forgotPassword({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPassword)
    const admin = await admin_service.GetAdminByEmail(email)
    await admin_service.UpdateValidationCode(admin.id)
    await admin_service.SendAdminForgotPasswordEmail(
      email,
      admin.profile.name,
      admin.verificationCode!,
      admin.id
    )
    await admin_service.LogOutAdmin(admin)
    return response.ok({ success: [{ message: 'Email enviado com sucesso.', status: 200 }] })
  }

  async restore({ params, response }: HttpContext) {
    const { id, type } = params
    if (type === 'admin') {
      await admin_service.RestoreAdmin(id)
      return response.ok({ success: [{ message: 'Admin recuperado com sucesso.', status: 200 }] })
    }
    if (type === 'professor') {
      await professor_service.RestoreProfessor(id)
      return response.ok({
        success: [{ message: 'Professor recuperado com sucesso.', status: 200 }],
      })
    }
    if (type === 'student') {
      await student_service.RestoreStudent(id)
      return response.ok({ success: [{ message: 'Aluno recuperado com sucesso.', status: 200 }] })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const { id, type } = params
    if (type === 'admin') {
      await admin_service.DestroyAdmin(id)
      return response.ok({ success: [{ message: 'Admin excluído com sucesso.', status: 200 }] })
    }
    if (type === 'professor') {
      await professor_service.DestroyProfessor(id)
      return response.ok({
        success: [{ message: 'Professor excluído com sucesso.', status: 200 }],
      })
    }
    if (type === 'student') {
      await student_service.DestroyStudent(id)
      return response.ok({ success: [{ message: 'Aluno excluído com sucesso.', status: 200 }] })
    }
  }

  async delete({ params, response }: HttpContext) {
    const { id, type } = params
    if (type === 'admin') {
      await admin_service.DeleteAdmin(id)
      return response.ok({ success: [{ message: 'Admin excluído com sucesso.', status: 200 }] })
    }
    if (type === 'professor') {
      await professor_service.DeleteProfessor(id)
      return response.ok({
        success: [{ message: 'Professor excluído com sucesso.', status: 200 }],
      })
    }
    if (type === 'student') {
      await student_service.DeleteStudent(id)
      return response.ok({ success: [{ message: 'Aluno excluído com sucesso.', status: 200 }] })
    }
  }
}
