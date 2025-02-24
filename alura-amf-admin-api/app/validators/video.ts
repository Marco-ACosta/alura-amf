import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new video.
 */
export const createVideoValidator = vine.compile(
  vine.object({
    title: vine.string(),
    description: vine.string(),
    releaseDate: vine.date({
      formats: 'YYYY-MM-DD HH:mm:ss',
    }),
    video: vine.file({
      size: '100mb',
      extnames: ['mp4', 'png'],
    }),
    thumbnail: vine.file(),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing video.
 */
// export const updateVideoValidator = vine.compile(
//   vine.object({})
// )
