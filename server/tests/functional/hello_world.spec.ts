import { test } from "@japa/runner";

test("display welcome page", async ({ client }) => {
  const response = await client.get("/");

  response.assertStatus(200);
  response.assertBodyContains({ hello: "world" });
});

import Database from "@ioc:Adonis/Lucid/Database";

test.group("Refactored Test", () => {
  test("should insert data into transaksi_parkir table", async (assert) => {
    // Mock the necessary dependencies
    const mockRawQuery = sinon.stub(Database, "rawQuery");
    mockRawQuery.resolves();

    // Test data
    const dataToStore = {
      // Add the necessary data properties here
    };

    // Call the function
    const insertQuery = `INSERT INTO transaksi_parkir SET ?`;
    await Database.rawQuery(insertQuery, [dataToStore]);

    // Assertion
    assert.calledOnce(mockRawQuery);
    assert.calledWith(mockRawQuery, insertQuery, [dataToStore]);
  });
});
