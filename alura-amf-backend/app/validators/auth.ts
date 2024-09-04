import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
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

export const setPasswordValidator = vine.compile(
  vine.object({
    password: vine
      .string()
      .confirmed()
      .minLength(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[A-Za-z\d\W]{8,}$/),
  })
)
