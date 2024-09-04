// padrão de nomenclatura de tipo 'ação + modelo + type'

export type StoreVideoType = {
  title: string
  description: string
  is_active: boolean
  release_date: number
}

export type UpdateVideoType = {
  title?: string
  description?: string
  is_active?: boolean
  release_date?: number
}

export type StoreAdminType = {
  email: string
  cpf: string
  profileId: string
  verificationCode: string
}

export type StoreProfileType = {
  name: string
  lastName: string
  phone: string
  type: string
}

export type CreateAdminType = {
  name: string
  lastName: string
  phone: string
  type: string
  email: string
  cpf: string
}

export type StoreProfessorType = {
  email: string
  password: string
  cpf: string
  lattes: string
  profileId: string
}

export type CreateProfessorType = {
  name: string
  lastName: string
  phone: string
  type: string
  email: string
  password: string
  lattes: string
  cpf: string
}

export type StoreStudentType = {
  email: string
  password: string
  cpf: string
  profileId: string
  academicRegister: string
}

export type CreateStudentType = {
  name: string
  lastName: string
  phone: string
  type: string
  email: string
  password: string
  academicRegister: string
  cpf: string
}

export type Pagination = {
  page: number
  limit: number
}

export type UpdateAdminType = {
  name: string
  lastName: string
  phone: string
  email: string
  cpf: string
}

export type ChangeAdminInfoType = {
  email: string
  cpf: string
}

export type ChangeProfileInfoType = {
  name: string
  lastName: string
  phone: string
}

export type DeleteUsersType = {
  deletedAt?: number | null
  isActive: boolean
}

export type ChangePasswordType = {
  password: string
  verificationCode?: string | null
}

export type VerificationCodeType = {
  verificationCode: string
}

export type UpdateProfessorType = {
  name: string
  lastName: string
  phone: string
  email: string
  lattes: string
  cpf: string
}

export type ChangeProfessorInfoType = {
  email: string
  lattes: string
  cpf: string
}
