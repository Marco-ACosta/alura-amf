import vine from '@vinejs/vine'

/** Valida a atualização do perfil de um estudante */
export const updateStudentValidator = vine.compile(
  vine.object({
    name: vine.string(),
    lastName: vine.string(),
    phone: vine
      .string()
      .alphaNumeric()
      .regex(/^\d{11}$/)
      .fixedLength(11),
    cpf: vine
      .string()
      .alphaNumeric()
      .regex(/^\d{11}$/)
      .fixedLength(11)
      .unique(async (db, value, field) => {
        return !(await db
          .from('students')
          .where('cpf', value)
          .andWhereNot('id', field.data.params.id)
          .first())
      }),
    academicRegister: vine
      .string()
      .alphaNumeric()
      .regex(/^[0-9]+$/)
      .unique(async (db, value, field) => {
        return !(await db
          .from('students')
          .where('academic_register', value)
          .andWhereNot('id', field.data.params.id)
          .first())
      }),
    email: vine
      .string()
      .email()
      .unique(async (db, value, field) => {
        return !(await db
          .from('students')
          .where('email', value)
          .andWhereNot('id', field.data.params.id)
          .first())
      }),
  })
)

/** Valida o login de um usuário */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)

export const setPasswordValidator = vine.compile(
  vine.object({
    password: vine
      .string()
      .confirmed()
      .minLength(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[A-Za-z\d\W]{8,}$/),
  })
)

export const changePasswordValidator = vine.compile(
  vine.object({
    oldPassword: vine.string(),
    newPassword: vine
      .string()
      .confirmed()
      .minLength(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[A-Za-z\d\W]{8,}$/),
  })
)

// Definição do schema de validação para `forgotPassword`
export const forgotPassword = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .exists(async (db, value) => {
        return await db.from('students').where('email', value).first()
      }),
  })
)
