import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ManlessEntrygate extends BaseSchema {
protected tableName = 'gate_transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary()
      table.string('entry_detected_plates').nullable()
      table.string('entry_plate_number').nullable()
      table.string('entry_plate_image').nullable()
      table.string('entry_driver_image').nullable()
      table.timestamp('entry_time', { useTz: false }).nullable()
      table.timestamp('exit_time', { useTz: false }).nullable()
      table.string('exit_plate_image').nullable()
      table.string('exit_driver_image').nullable()
      table.string('exit_plate_number').nullable()
      table.string('exit_detected_plates').nullable()
      table.decimal('parking_fee', 10, 2).nullable()
      table.string('location').notNullable()
      table.float('processing_time').nullable()
      table.string('operator').nullable()
      table.integer('transaction_status').defaultTo(0)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}