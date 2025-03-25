import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'

export default class MainSeeder extends BaseSeeder {
  private async runSeeder(seeder: { default: typeof BaseSeeder }) {
    await new seeder.default(Application.container.resolveBinding('Adonis/Lucid/Database').connection()).run()
  }

  public async run() {
    // Run initial configuration seeders first
    await this.runSeeder(await import('../seeders/InitialSeeder'))
    
    // Run tariff configuration seeder
    await this.runSeeder(await import('../seeders/TarifSeeder'))
    
    // Run membership data seeder
    await this.runSeeder(await import('../seeders/MembershipSeeder'))
    
    // Run transaction data seeder last
    await this.runSeeder(await import('../seeders/TransaksiSeeder'))
  }
}