import { BaseCommand } from '@adonisjs/core/build/standalone'
import { join } from 'path'
import { symlink, mkdir, rm } from 'fs/promises'
import { existsSync } from 'fs'
import os from 'os'
import { exec } from 'child_process'

export default class CreateUploadsSymlink extends BaseCommand {
  public static commandName = 'create:uploads:symlink'
  public static description = 'Creates symlink for uploads directory and sets permissions'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    const basePath = os.platform() === 'win32' 
      ? join('C:\\parkir\\uploads') 
      : join(os.homedir(), 'parkir', 'uploads')

    const uploadsPath = join(basePath, 'images')
    const plateEntryPath = join(uploadsPath, 'plate', 'entry')
    const plateExitPath = join(uploadsPath, 'plate', 'exit')
    const driverEntryPath = join(uploadsPath, 'driver', 'entry')
    const driverExitPath = join(uploadsPath, 'driver', 'exit')

    try {
      // Create all required directories
      const dirs = [
        uploadsPath,
        plateEntryPath,
        plateExitPath,
        driverEntryPath,
        driverExitPath,
      ]

      for (const dir of dirs) {
        if (!existsSync(dir)) {
          await mkdir(dir, { recursive: true })
        }
      }

      // Ensure the public folder exists
      const publicPath = this.application.publicPath()
      if (!existsSync(publicPath)) {
        await mkdir(publicPath, { recursive: true })
      }

      // Remove existing symlink if it exists
      const symlinkPath = this.application.publicPath('uploads')
      if (existsSync(symlinkPath)) {
        await rm(symlinkPath, { recursive: true, force: true })
      }

      // Create the symlink
      await symlink(basePath, symlinkPath, 'junction')
      console.log('Symlink created:', symlinkPath, '->', basePath)

      // Set permissions for the basePath
      if (os.platform() === 'win32') {
        exec(`icacls "${basePath}" /grant Everyone:(OI)(CI)F /T`, (error, stdout, stderr) => {
          if (error) {
            console.error('Failed to set permissions on Windows:', error)
            return
          }
          console.log('Permissions set successfully on Windows:', stdout)
        })
      } else {
        exec(`chmod -R 755 "${basePath}" && chown -R $USER:$USER "${basePath}"`, (error, stdout, stderr) => {
          if (error) {
            console.error('Failed to set permissions on Linux:', error)
            return
          }
          console.log('Permissions set successfully on Linux:', stdout)
        })
      }

      this.logger.success('Symlink and directories created successfully with proper permissions')
    } catch (error) {
      this.logger.error('Failed to create symlink and directories')
      this.logger.error(error)
    }
  }
}
