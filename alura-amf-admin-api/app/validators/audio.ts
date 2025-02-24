import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new audio.
 */
export const createAudioValidator = vine.compile(
  vine.object({
    title: vine.string(),
    releaseDate: vine.date(),
    audio: vine.file(),
    thumbnail: vine.file(),
    description: vine.string(),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing audio.
//  */
// export const updateAudioValidator = vine.compile(
//   vine.object({})
// )
