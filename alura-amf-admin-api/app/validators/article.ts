import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new article.
 */
export const createArticleValidator = vine.compile(
  vine.object({
    title: vine.string(),
    subtitle: vine.string(),
    releaseDate: vine.date(),
    article: vine.file(),
    thumbnail: vine.file(),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing article.
 */
// export const updateArticleValidator = vine.compile(
//   vine.object({})
// )
