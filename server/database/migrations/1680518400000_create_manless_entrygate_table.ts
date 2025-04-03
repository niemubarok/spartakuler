import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ManlessEntrygate extends BaseSchema {
protected tableName = 'gate_transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id')
      table.string('plate_number').notNullable()
      table.string('plate_image').nullable()
      table.string('driver_image').nullable()
      table.timestamp('entry_time', { useTz: false }).nullable()
      table.timestamp('exit_time', { useTz: false }).nullable()
      table.decimal('parking_fee', 10, 2).nullable()
      table.string('gate_status').notNullable()
      table.string('location').notNullable()
      table.float('processing_time').nullable()
      table.string('operator').nullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}