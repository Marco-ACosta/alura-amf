export type StudentInput = {
  name: string
  lastName: string
  phone: string
  email: string
  cpf: string
  academicRegister: string
}

export type StudentOutput = {
  id: string
} & StudentInput

export type CreateStudentProps = {} & StudentInput

export type UpdateStudentProps = {} & CreateStudentProps & StudentOutput

export type ChangePasswordType = { password: string; verificationCode?: string | null }
