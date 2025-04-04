import ls from 'localstorage-slim'

const isElectron = window && window.electron

const exitGateMode = ls.get('exitGateMode') || false

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "",
        name: "outgate",
        component: () => {
          if (isElectron) {
            if( exitGateMode) {
              return import("pages/ExitGatePage.vue");
            }
            return import("pages/EntryGatePage.vue");
          } else {
            return import("pages/LaporanTransaksiPerHariPage.vue");
          }
        },
        meta: {
          isSidebar: window && window.electron ? false : true,
          isHeader: window && window.electron ? false : true,
          requiresAuth: true,
        },
      },
      // {
      //   path: "/pic",
      //   name: "picture",
      //   component: () => import("pages/VehicleImagePage.vue"),
      //   meta: {
      //     isSidebar: false,
      //     isHeader: false,
      //     requiresAuth: false,
      //   },
      // },
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
      {
        path: "/petugas",
        name: "petugas",
        component: () => import("pages/PetugasPage.vue"),
        meta: {
          isSidebar: true,
          isHeader: true,
          requiresAuth: true,
        },
      },
      { 
        path: '/entry-gate', 
        name: 'entry-gate',
        component: () => import('pages/EntryGatePage.vue') 
      }
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
