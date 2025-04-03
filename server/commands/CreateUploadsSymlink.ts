import { BaseCommand } from '@adonisjs/core/build/standalone'
import { join } from 'path'
import { symlink, mkdir, rm } from 'fs/promises'
import { existsSync } from 'fs'

export default class CreateUploadsSymlink extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'create:uploads:symlink'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Creates symlink for uploads directory'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest` 
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call 
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    const publicPath = this.application.publicPath('uploads')
    const uploadsPath = join(this.application.tmpPath(), 'uploads')
    const imagesPath = join(uploadsPath, 'images')
    const platePath = join(imagesPath, 'plate')
    const driverPath = join(imagesPath, 'driver')

    try {
      // Create all required directories
      const dirs = [
        this.application.publicPath(),
        this.application.tmpPath(),
        uploadsPath,
        imagesPath,
        platePath,
        driverPath
      ]

      for (const dir of dirs) {
        if (!existsSync(dir)) {
          await mkdir(dir, { recursive: true })
        }
      }

      // Remove existing symlink if it exists
      if (existsSync(publicPath)) {
        await rm(publicPath, { recursive: true, force: true })
      }

      // Create the symlink
      await symlink(uploadsPath, publicPath, 'junction')
      this.logger.success('Symlink and directories created successfully')
    } catch (error) {
      this.logger.error('Failed to create symlink and directories')
      this.logger.error(error)
    }
  }
}
