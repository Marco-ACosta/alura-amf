import Archive from '#models/archive'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import fs from 'node:fs'

export default {
  /**
   * Creates a new archive record and stores the file on the server.
   *
   * @param file - The uploaded file
   * @returns A promise that resolves when the archive record is created and the file is stored on the server.
   */
  async createOne(file: MultipartFile): Promise<Archive> {
    return db.transaction(async (transaction) => {
      const { fileName, filePath } = await this.moveFileToServer(file)
      return Archive.create(
        {
          file_name: fileName,
          file_path: filePath,
          file_type: file.extname!,
          file_size: file.size,
        },
        { client: transaction }
      )
    })
  },

  /**
   * Moves the uploaded file to the server and returns an object with the filename and filepath.
   *
   * @param uploadedFile - The uploaded file
   * @returns A promise that resolves when the file is moved and the object with the filename and filepath is returned.
   */
  async moveFileToServer(
    uploadedFile: MultipartFile
  ): Promise<{ fileName: string; filePath: string }> {
    const timestamp = Date.now()
    const fileName = `${timestamp}.${uploadedFile.extname}`
    const filePath = 'uploads/videos/' + fileName

    uploadedFile.move(app.makePath('uploads/videos'), { name: fileName })
    return { fileName, filePath }
  },

  /**
   * Moves an archive file to the server and returns an object with the filename and filepath.
   *
   * @param archive - The archive file to be moved
   * @returns A promise that resolves when the file is moved and the object with the filename and filepath is returned.
   */
  async moveOneToServer(archive: MultipartFile): Promise<{ fileName: string; filePath: string }> {
    const timestamp = Date.now()
    const fileName = `${timestamp}.${archive.extname}`
    const filePath = 'uploads/videos/' + fileName

    archive.move(app.makePath('uploads/videos'), {
      name: fileName,
    })

    return { fileName, filePath }
  },

  /**
   * Removes a file from the server.
   *
   * @param filePath - The path of the file to be removed.
   */
  async removeOneToServer(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },

  /**
   * Deletes an archive record and removes the file from the server.
   *
   * @param archiveId - The ID of the archive record to be deleted.
   * @returns A promise that resolves when the archive record is deleted and the associated file is removed from the server.
   */
  async deleteOne(archiveId: string) {
    await db.transaction(async (trx) => {
      const archive = await this.getArchiveById(archiveId)
      await this.removeArchiveFile(archive.file_path)
      await archive.useTransaction(trx).delete()
    })
  },

  /**
   * Removes a file from the server.
   *
   * @param filePath - The path of the file to be removed.
   * @returns A promise that resolves when the file is removed from the server.
   */
  async removeArchiveFile(filePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Using the callback approach to maintain compatibility with older Node.js versions
      // that do not support the async/await syntax.
      fs.unlink(filePath, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  },

  /**
   * Retrieves an archive record by the provided ID.
   *
   * @param archiveId - The ID of the archive record to be retrieved.
   * @returns A promise that resolves when the archive record is retrieved.
   */
  async getArchiveById(archiveId: string): Promise<Archive> {
    return await Archive.findOrFail(archiveId)
  },
}
