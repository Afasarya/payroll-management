interface MenuItem {
    headTitle1?: string;
    headTitle2?: string;
    title?: string;
    icon?: string;
    icon1?: string;
    type: string;
    badgeType?: string;
    active?: boolean;
    isPinned?: boolean;
    path?: string;
    children?: MenuItem[];
    bookmark?: boolean;
}

export const menu: MenuItem[] = [
    {
        headTitle1: "General",
        headTitle2: "Dashboards & Layout.",
        type: "headtitle"
    },
    {
        title: "Dashboards",
        icon: "stroke-home",
        icon1: "fill-home",
        type: "sub",
        badgeType: "light-primary",
        active: false,
        isPinned: false,
        children: [
            {
                path: "/dashboards/dashboard_default",
                title: "Default",
                type: "link"
            },
            {
                path: "/dashboards/dashboard_project",
                title: "Project",
                type: "link"
            }
        ]
    },
    
    {
        headTitle1: "Payroll System",
        headTitle2: "Payroll Management Modules",
        type: "headtitle"
    },
    
    {
        title: "Data Pegawai",
        icon: "stroke-user",
        icon1: "fill-user",
        type: "sub",
        active: false,
        isPinned: false,
        children: [
            {
                path: "/payroll/data-pegawai",
                title: "Daftar Pegawai",
                type: "link"
            },
            {
                path: "/payroll/data-pegawai/tambah",
                title: "Tambah Pegawai",
                type: "link"
            }
        ]
    },
    
    {
        title: "Payroll Management",
        icon: "stroke-dollar-sign",
        icon1: "fill-dollar-sign",
        type: "sub",
        active: false,
        isPinned: false,
        children: [
            {
                path: "/payroll/data-pegawai-payroll",
                title: "Data Pegawai Payroll",
                type: "link"
            },
            {
                path: "/payroll/template-payroll",
                title: "Template Payroll",
                type: "link"
            },
            {
                path: "/payroll/payroll-komponen",
                title: "Komponen Payroll",
                type: "link"
            }
        ]
    },
    
    {
        title: "Proses Payroll",
        icon: "stroke-calendar",
        icon1: "fill-calender",
        type: "sub",
        active: false,
        isPinned: false,
        children: [
            {
                path: "/payroll/generate-payroll",
                title: "Generate Payroll",
                type: "link"
            },
            {
                path: "/payroll/approval-payroll",
                title: "Approval Payroll",
                type: "link"
            }
        ]
    },
    
    {
        title: "Laporan",
        icon: "stroke-file",
        icon1: "fill-file",
        type: "sub",
        active: false,
        isPinned: false,
        children: [
            {
                path: "/payroll/cetak-slip-gaji",
                title: "Cetak Slip Gaji",
                type: "link"
            },
            {
                path: "/payroll/cetak-laporan-gaji",
                title: "Laporan Gaji",
                type: "link"
            }
        ]
    },
    
    {
        headTitle1: "Settings",
        headTitle2: "Account & System Settings",
        type: "headtitle"
    },
    {
        path: "/users/profile",
        title: "Profile",
        icon: "stroke-user",
        icon1: "fill-user",
        type: "link",
        isPinned: false
    }
]