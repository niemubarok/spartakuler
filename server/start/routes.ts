/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.group(() => {
    Route.get("/all", "TransactionsController.index");
    Route.post("/nopol", "TransactionsController.getDataByNopol");
    Route.post("/pic", "TransactionsController.getPicture");
    Route.post("/create", "TransactionsController.create");
    Route.patch("/update", "TransactionsController.update");
    Route.get(
      "/count/vehicle/in",
      "TransactionsController.countVehicleInToday"
    );
    Route.get(
      "/count/vehicle/out",
      "TransactionsController.countVehicleOutToday"
    );
    Route.get(
      "/count/vehicle/inside",
      "TransactionsController.countVehicleInside"
    );
  }).prefix("transactions");

  Route.group(() => {
    Route.get("/all", "VehiclesController.index");
  }).prefix("vehicles");

  Route.group(() => {
    Route.get("/all", "CustomersController.index");
    Route.post("/nopol", "CustomersController.getCustomerByNopol");
  }).prefix("customers");

  Route.group(() => {
    Route.get("/all", "UsersController.index");
    Route.post("/login", "UsersController.login");
  }).prefix("user");

  Route.group(() => {
    Route.get("/all", "ShiftsController.index");
    // Route.get("/login", "UsersController.login");
  }).prefix("shifts");

  Route.group(() => {
    Route.get("/all", "LocationsController.index");
  }).prefix("locations");

  Route.group(() => {
    Route.get("/all", "PricesController.index");
    Route.post("/type", "PricesController.tarifPerJenisKendaraan");
  }).prefix("prices");
}).prefix("api");
