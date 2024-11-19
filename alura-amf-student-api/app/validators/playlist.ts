import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new playlist.
 */
export const createPlaylistValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().optional(),
    isPublic: vine.boolean().nullable().optional(),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing playlist.
 */
export const updatePlaylistValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    description: vine.string().optional(),
    isPublic: vine.boolean().nullable().optional(),
    contents: vine
      .array(
        vine.object({
          contentId: vine
            .string()
            .uuid({ version: [4] })
            .exists(async (db, value) => {
              return await db.from('contents').where('id', value).first()
            }),
          order: vine.number(),
        })
      )
      .optional(),
  })
)

export const addContentToPlaylistValidator = vine.compile(
  vine.object({
    contentId: vine
      .string()
      .uuid({ version: [4] })
      .exists(async (db, value) => {
        return await db.from('contents').where('id', value).first()
      }),
  })
)

export const removeContentFromPlaylistValidator = vine.compile(
  vine.object({
    contentId: vine
      .string()
      .uuid({ version: [4] })
      .exists(async (db, value) => {
        return await db.from('contents').where('id', value).first()
      }),
  })
)
