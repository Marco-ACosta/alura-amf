import ffmpeg from 'fluent-ffmpeg'
// import { StoreVideoType, UpdateVideoType } from './../utils/types.js'
// import Video from '#models/video'
// import ArchiveService from './archive_service.js'
// import { getUnixTime } from 'date-fns'
// import { MultipartFile } from '@adonisjs/core/bodyparser'
// import db from '@adonisjs/lucid/services/db'
export default class VideoService {
  //   /**
  //    * Creates a new video record in the database.
  //    * @param videoData The input data for the video, including title, description, release date, and whether it is active or not.
  //    * @param filePath The path to the video file.
  //    * @param archiveId The ID of the archive record for the video.
  //    * @returns The new video record.
  //    */
  //   static async createOne(
  //     videoData: StoreVideoType,
  //     filePath: string,
  //     archiveId: string
  //   ): Promise<Video> {
  //     // Create the video record in the database
  //     const video = await Video.create({
  //       ...videoData,
  //       archive_id: archiveId,
  //       duration: await VideoService.getVideoDuration(filePath),
  //       created_at: getUnixTime(new Date()),
  //     })

  //     return video
  //   }

  //   /**
  //    * Retrieves a video record from the database by its ID.
  //    * @param videoId The ID of the video.
  //    * @returns The video record.
  //    * @throws {ModelNotFoundException} If the video record is not found.
  //    */
  //   static async getOne(videoId: string): Promise<Video> {
  //     // Retrieve the video record from the database
  //     // by its ID, and preload the associated archive record.
  //     return Video.query().where('id', videoId).preload('archive').firstOrFail()
  //   }

  /**
   * Retrieves the duration of a video file using ffprobe.
   * @param filePath The path to the video file.
   * @returns The duration of the video in seconds.
   * @throws {Error} If there is an error executing ffprobe.
   */
  static async getVideoDuration(filePath: string): Promise<number> {
    // Execute ffprobe to retrieve metadata about the video file.
    // The duration is stored in the "format.duration" field of the metadata object.
    const duration = await new Promise<number>((resolve, reject) => {
      ffmpeg(filePath).ffprobe((err, metadata) => {
        if (err) {
          reject(err)
        } else {
          resolve(Math.floor(Number(metadata.format.duration!)))
        }
      })
    })
    return duration
  }

  //   /**
  //    * Deletes a video record and its associated archive record from the database.
  //    * @param videoId The ID of the video to delete.
  //    * @throws {ModelNotFoundException} If the video record is not found.
  //    * @throws {Error} If there is an error deleting the video or archive records.
  //    */
  //   static async deleteOne(videoId: string): Promise<void> {
  //     db.transaction(async () => {
  //       const video = await this.getOne(videoId)
  //       await ArchiveService.deleteOne(video.archive_id)
  //       await video.delete()
  //     })
  //   }

  //   /**
  //    * Retrieves a paginated list of video records.
  //    *
  //    * @param orderByColumn - The column to order the records by. Default: 'createdAt'.
  //    * @param orderByDirection - The direction to order the records in. Default: 'desc'.
  //    * @param isActiveFilter - Filter records by active status. Default: undefined.
  //    * @param isReleasedFilter - Filter records by released status. Default: undefined.
  //    * @param page - The page number of the paginated results. Default: 1.
  //    * @param limit - The maximum number of records per page. Default: 10.
  //    * @param maxDuration - The maximum duration of a video in seconds. Default: undefined.
  //    * @param searchQuery - A query string to search for in the video titles. Default: undefined.
  //    * @returns A paginated serialized list of video records.
  //    */
  //   static async getAll(
  //     orderByColumn: string = 'createdAt',
  //     orderByDirection: 'asc' | 'desc' = 'desc',
  //     isActiveFilter: string,
  //     isReleasedFilter: string,
  //     page: number = 1,
  //     limit: number = 10,
  //     maxDuration?: number,
  //     searchQuery?: string
  //   ) {
  //     // Get the current time
  //     const currentTime = getUnixTime(new Date())

  //     // Query the database for video records
  //     const video = Video.query()
  //       .if(searchQuery, (query) => query.where('title', 'like', `%${searchQuery}%`))
  //       .if(isActiveFilter === 'true', (query) => query.where('is_active', true))
  //       .if(isActiveFilter === 'false', (query) => query.where('is_active', false))
  //       .if(isReleasedFilter === 'true', (query) => query.where('release_date', '>=', currentTime))
  //       .if(isReleasedFilter === 'false', (query) => query.where('release_date', '<', currentTime))
  //       .if(maxDuration, (query) => query.where('duration', '<=', maxDuration!))
  //       .preload('archive')
  //       .orderBy(orderByColumn, orderByDirection)
  //       .paginate(page, limit)

  //     const data = await video
  //     return data.serialize()
  //   }

  //   /**
  //    * Updates a video record in the database.
  //    * @param video - The video record to update.
  //    * @param data - The data to update the video record with.
  //    * @returns The updated video record.
  //    */
  //   static async updateOne(video: Video, data: UpdateVideoType) {
  //     return db.transaction(async (trx) => {
  //       return await video.useTransaction(trx).merge(data).save()
  //     })
  //   }

  //   /**
  //    * Reuploads a video record in the database.
  //    * @param video - The video record to reupload.
  //    * @param archive - The new archive file to upload.
  //    * @returns A promise that resolves once the video record has been reuploaded.
  //    */
  //   static async reuploadOne(video: Video, archive: MultipartFile): Promise<void> {
  //     const originalArchiveId = video.archive_id

  //     const newArchive = await ArchiveService.createOne(archive)

  //     const newVideoDuration = await this.getVideoDuration(newArchive.filePath)

  //     await db.transaction(async (trx) => {
  //       await video
  //         .useTransaction(trx)
  //         .merge({
  //           archive_id: newArchive.id,
  //           duration: newVideoDuration,
  //         })
  //         .save()
  //       await ArchiveService.deleteOne(originalArchiveId)
  //     })
  //   }
}
