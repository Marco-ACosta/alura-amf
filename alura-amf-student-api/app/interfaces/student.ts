import { AccessToken } from '@adonisjs/auth/access_tokens'
import IBase from './base/base.js'
import Student from '#models/student'
import { CreateStudentProps, UpdateStudentProps } from '../types/student.js'

// eslint-disable-next-line @typescript-eslint/naming-convention
export default interface IStudentService
  extends IBase<Student, CreateStudentProps, UpdateStudentProps> {
  /**
   * Login do usuário
   * @returns {Promise<AccessToken>} Token de acesso completo
   */
  Login(email: string, password: string): Promise<AccessToken>
  LogOut(student: Student): Promise<void>
}
