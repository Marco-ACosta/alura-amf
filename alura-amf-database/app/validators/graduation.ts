import vine from '@vinejs/vine'

export const graduationStoreValidator = vine.compile(
  vine.object({
    name: vine.string().unique(async (db, value) => {
      return !(await db.from('graduations').where('name', value).first())
    }),
    color: vine.string().regex(/^#[0-9a-fA-F]{6}$/),
    description: vine.string(),
    icon: vine.file({
      extnames: ['ico', '.svg'],
    }),
  })
)

export const graduationUpdateValidator = vine.compile(
  vine.object({
    name: vine.string(),
    color: vine.string().regex(/^#[0-9a-fA-F]{6}$/),
    description: vine.string(),
    icon: vine.file({
      extnames: ['ico', '.svg'],
    }),
  })
)
