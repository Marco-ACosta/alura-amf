import vine from '@vinejs/vine'

export const professorStoreValidator = vine.compile(
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
        return !(await db.from('professors').where('cpf', value).first())
      }),
    lattes: vine
      .string()
      .url()
      .normalizeUrl()
      .unique(async (db, value) => {
        return !(await db.from('professors').where('lattes', value).first())
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

export const professorUpdateValidator = vine.compile(
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
          .from('professors')
          .where('cpf', value)
          .andWhereNot('id', field.data.params.id)
          .first())
      }),
    lattes: vine
      .string()
      .url()
      .normalizeUrl()
      .unique(async (db, value, field) => {
        return !(await db
          .from('professors')
          .where('lattes', value)
          .andWhereNot('id', field.data.params.id)
          .first())
      }),
    email: vine
      .string()
      .email()
      .unique(async (db, value, field) => {
        return !(await db
          .from('professors')
          .where('email', value)
          .andWhereNot('id', field.data.params.id)
          .first())
      }),
  })
)
