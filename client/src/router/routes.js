const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/outgate",
        name: "outgate",
        component: () => import("pages/OutGatePage.vue"),
        meta: {
          isSidebar: false,
          isHeader: false,
          requiresAuth: true,
        },
      },
      {
        path: "/pic",
        name: "picture",
        component: () => import("pages/VehicleImagePage.vue"),
        meta: {
          isSidebar: false,
          isHeader: false,
          requiresAuth: false,
        },
      },
      {
        path: "/transaksi/create",
        name: "createTransaksi",
        component: () => import("pages/CreateTransactionPage.vue"),
        meta: {
          isSidebar: false,
          isHeader: false,
          requiresAuth: true,
        },
      },
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("pages/DashboardPage.vue"),
        meta: {
          isSidebar: true,
          isHeader: true,
          requiresAuth: true,
        },
      },
      {
        path: "/daftar-transaksi",
        name: "daftarTransaksi",
        component: () => import("pages/LaporanTransaksiPerHariPage.vue"),
        meta: {
          isSidebar: true,
          isHeader: true,
          requiresAuth: true,
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
