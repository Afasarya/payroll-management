import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import BodyView from "@/layout/BodyView.vue"
import AuthView from "@/components/common/block/auth/AuthView.vue"
import LoginPage from "@/components/common/block/auth/LoginPage.vue"
import indexDefault from "@/pages/dashbords/indexDefault.vue"
import indexProject from "@/pages/dashbords/indexProject.vue"
import indexEcommerce from "@/pages/dashbords/indexEcommerce.vue"
import indexEducation from "@/pages/dashbords/indexEducation.vue"

// Payroll Management System pages
import DataPegawai from "@/pages/payroll/DataPegawai.vue"
import DataPegawaiForm from "@/pages/payroll/DataPegawaiForm.vue"
import DataPegawaiDetail from "@/pages/payroll/DataPegawaiDetail.vue"
import DataPegawaiPayroll from "@/pages/payroll/DataPegawaiPayroll.vue"
import DataPegawaiPayrollForm from "@/pages/payroll/DataPegawaiPayrollForm.vue"
import TemplatePayroll from "@/pages/payroll/TemplatePayroll.vue"
import TemplatePayrollForm from "@/pages/payroll/TemplatePayrollForm.vue"
import PayrollKomponen from "@/pages/payroll/PayrollKomponen.vue"
import PayrollKomponenForm from "@/pages/payroll/PayrollKomponenForm.vue"
import GeneratePayroll from "@/pages/payroll/GeneratePayroll.vue"
import ApprovalPayroll from "@/pages/payroll/ApprovalPayroll.vue"
import CetakSlipGaji from "@/pages/payroll/CetakSlipGaji.vue"
import CetakLaporanGaji from "@/pages/payroll/CetakLaporanGaji.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: "/dashboards/dashboard_default"
  },
  {
    path: '/',
    name: 'home',
    component: BodyView,
    meta: {
      title: 'Mofi - Premium Vue Admin Template',
    },
    children: [
      {
        path: '',
        name: 'defaultRoot',
        component: indexDefault,
        meta: {
          title: 'Mofi - Premium Vue Admin Template',
        }
      }
    ]
  },
  {
    path: "/auth",
    component: AuthView,
    children: [
      {
        path: "login",
        name: "login",
        component: LoginPage,
        meta: {
          title: 'Mofi - Premium Vue Admin Template',
        }
      }
    ]
  },
  {
    path: "/dashboards",
    component: BodyView,
    children: [
      {
        path: "dashboard_default",
        name: "default",
        component: indexDefault,
        meta: {
          title: 'Dashboards | Mofi - Premium Vue Admin Template',
        }
      },
      {
        path: "dashboard_project",
        name: "project",
        component: indexProject,
        meta: {
          title: 'Dashboards CRM | Mofi - Premium Vue Admin Template',
        }
      },
      {
        path: "dashboard_ecommerce",
        name: "ecpmmerce",
        component: indexEcommerce,
        meta: {
          title: 'Dashboards Ecommerce | Mofi - Premium Vue Admin Template',
        }
      },
      {
        path: "dashboard_education",
        name: "education",
        component: indexEducation,
        meta: {
          title: 'Dashboards Education | Mofi - Premium Vue Admin Template',
        }
      }
    ]
  },
  // Payroll Management System Routes
  {
    path: "/payroll",
    component: BodyView,
    children: [
      {
        path: "data-pegawai",
        name: "dataPegawai",
        component: DataPegawai,
        meta: {
          title: 'Data Pegawai | Payroll Management System',
        }
      },
      {
        path: "data-pegawai/tambah",
        name: "tambahPegawai",
        component: DataPegawaiForm,
        meta: {
          title: 'Tambah Pegawai | Payroll Management System',
        }
      },
      {
        path: "data-pegawai/edit/:id",
        name: "editPegawai",
        component: DataPegawaiForm,
        meta: {
          title: 'Edit Pegawai | Payroll Management System',
        }
      },
      {
        path: "data-pegawai/detail/:id",
        name: "detailPegawai",
        component: DataPegawaiDetail,
        meta: {
          title: 'Detail Pegawai | Payroll Management System',
        }
      },
      {
        path: "data-pegawai-payroll",
        name: "dataPegawaiPayroll",
        component: DataPegawaiPayroll,
        meta: {
          title: 'Data Pegawai Payroll | Payroll Management System',
        }
      },
      {
        path: "data-pegawai-payroll/tambah",
        name: "tambahPegawaiPayroll",
        component: DataPegawaiPayrollForm,
        meta: {
          title: 'Tambah Pegawai Payroll | Payroll Management System',
        }
      },
      {
        path: "data-pegawai-payroll/edit/:id",
        name: "editPegawaiPayroll",
        component: DataPegawaiPayrollForm,
        meta: {
          title: 'Edit Pegawai Payroll | Payroll Management System',
        }
      },
      {
        path: "template-payroll",
        name: "templatePayroll",
        component: TemplatePayroll,
        meta: {
          title: 'Template Payroll | Payroll Management System',
        }
      },
      {
        path: "template-payroll/tambah",
        name: "tambahTemplatePayroll",
        component: TemplatePayrollForm,
        meta: {
          title: 'Tambah Template Payroll | Payroll Management System',
        }
      },
      {
        path: "template-payroll/edit/:id",
        name: "editTemplatePayroll",
        component: TemplatePayrollForm,
        meta: {
          title: 'Edit Template Payroll | Payroll Management System',
        }
      },
      {
        path: "payroll-komponen",
        name: "payrollKomponen",
        component: PayrollKomponen,
        meta: {
          title: 'Payroll Komponen | Payroll Management System',
        }
      },
      {
        path: "payroll-komponen/tambah",
        name: "tambahPayrollKomponen",
        component: PayrollKomponenForm,
        meta: {
          title: 'Tambah Payroll Komponen | Payroll Management System',
        }
      },
      {
        path: "payroll-komponen/edit/:id",
        name: "editPayrollKomponen",
        component: PayrollKomponenForm,
        meta: {
          title: 'Edit Payroll Komponen | Payroll Management System',
        }
      },
      {
        path: "generate-payroll",
        name: "generatePayroll",
        component: GeneratePayroll,
        meta: {
          title: 'Generate Payroll | Payroll Management System',
        }
      },
      {
        path: "approval-payroll",
        name: "approvalPayroll",
        component: ApprovalPayroll,
        meta: {
          title: 'Approval Payroll | Payroll Management System',
        }
      },
      {
        path: "cetak-slip-gaji",
        name: "cetakSlipGaji",
        component: CetakSlipGaji,
        meta: {
          title: 'Cetak Slip Gaji | Payroll Management System',
        }
      },
      {
        path: "cetak-laporan-gaji",
        name: "cetakLaporanGaji",
        component: CetakLaporanGaji,
        meta: {
          title: 'Cetak Laporan Gaji | Payroll Management System',
        }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  if (typeof (to.meta.title) === 'string') {
    document.title = to.meta.title;
  }
  const path = ['/auth/login', '/auth/register'];
  if (path.includes(to.path) || localStorage.getItem('user')) {
    return next();
  }
  next('/auth/login');
});

export default router