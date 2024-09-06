import vine from '@vinejs/vine'

export const studentStoreValidator = vine.compile(
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
      .unique(async (db, value) => {
        return !(await db.from('students').where('cpf', value).first())
      }),
    academicRegister: vine
      .string()
      .alphaNumeric()
      .regex(/^[0-9]+$/)
      .unique(async (db, value) => {
        return !(await db.from('students').where('academic_register', value).first())
      }),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        return !(await db.from('professors').where('email', value).first())
      }),
    password: vine
      .string()
      .minLength(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[A-Za-z\d\W]{8,}$/),
  })
)

export const studentUpdateValidator = vine.compile(
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
