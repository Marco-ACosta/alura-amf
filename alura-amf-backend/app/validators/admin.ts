import vine from '@vinejs/vine'

export const adminStoreValidator = vine.compile(
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
        return !(await db.from('admins').where('cpf', value).first())
      }),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        return !(await db.from('admins').where('email', value).first())
      }),
  })
)

export const adminUpdateValidator = vine.compile(
  vine.object({
    name: vine.string(),
    lastName: vine.string(),
    phone: vine
      .string()
      .alphaNumeric()
      .regex(/^\d{11}$/)
      .fixedLength(11),
    email: vine
      .string()
      .email()
      .unique(async (db, value, field) => {
        return !(await db
          .from('admins')
          .where('email', value)
          .whereNot('id', field.data.params.id)
          .first())
      }),
    cpf: vine
      .string()
      .alphaNumeric()
      .regex(/^\d{11}$/)
      .fixedLength(11)
      .unique(async (db, value, field) => {
        return !(await db
          .from('admins')
          .where('cpf', value)
          .whereNot('id', field.data.params.id)
          .first())
      }),
  })
)

export const forgotPassword = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .exists(async (db, value) => {
        return await db.from('admins').where('email', value).first()
      }),
  })
)
