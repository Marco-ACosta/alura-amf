import Professor from '#models/professor'
import professor_service from '#services/professor_service'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { PaginationDefault } from '../utils/consts.js'
import { professorUpdateValidator } from '#validators/professor'

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
}
