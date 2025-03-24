import { defineStore } from "pinia";

export const usePegawaiStore = defineStore('pegawai', {
  state: () => ({
    pegawaiList: [
      {
        id: 1,
        nama: "John Doe",
        jabatan: "Manager",
        departemen: "IT",
        tanggalBergabung: "2022-01-15",
        status: "Aktif"
      },
      {
        id: 2,
        nama: "Jane Smith",
        jabatan: "Developer",
        departemen: "IT",
        tanggalBergabung: "2022-03-20",
        status: "Aktif"
      },
      {
        id: 3,
        nama: "Robert Johnson",
        jabatan: "HR Specialist",
        departemen: "HR",
        tanggalBergabung: "2021-11-05",
        status: "Aktif"
      },
      {
        id: 4,
        nama: "Emily Davis",
        jabatan: "Finance Manager",
        departemen: "Finance",
        tanggalBergabung: "2023-02-10",
        status: "Aktif"
      },
      {
        id: 5,
        nama: "Michael Wilson",
        jabatan: "Marketing Specialist",
        departemen: "Marketing",
        tanggalBergabung: "2022-07-18",
        status: "Aktif"
      }
    ],
    pegawaiPayrollList: [
      {
        id: 1,
        pegawaiId: 1,
        gajiPokok: 10000000,
        tunjangan: 2000000,
        potongan: 500000,
        totalGaji: 11500000
      },
      {
        id: 2,
        pegawaiId: 2,
        gajiPokok: 8000000,
        tunjangan: 1500000,
        potongan: 400000,
        totalGaji: 9100000
      },
      {
        id: 3,
        pegawaiId: 3,
        gajiPokok: 9000000,
        tunjangan: 1800000,
        potongan: 450000,
        totalGaji: 10350000
      }
    ],
    templatePayroll: [
      {
        id: 1,
        nama: "Template Standard",
        deskripsi: "Template payroll standard untuk karyawan",
        komponenGaji: ["Gaji Pokok", "Tunjangan Transport", "Tunjangan Makan", "BPJS Kesehatan", "BPJS Ketenagakerjaan"]
      },
      {
        id: 2,
        nama: "Template Management",
        deskripsi: "Template payroll untuk level manajemen",
        komponenGaji: ["Gaji Pokok", "Tunjangan Jabatan", "Tunjangan Transport", "Tunjangan Makan", "BPJS Kesehatan", "BPJS Ketenagakerjaan", "Bonus Kinerja"]
      }
    ],
    payrollKomponen: [
      {
        id: 1,
        nama: "Gaji Pokok",
        tipe: "Pendapatan",
        isMandatory: true
      },
      {
        id: 2,
        nama: "Tunjangan Transport",
        tipe: "Pendapatan",
        isMandatory: false
      },
      {
        id: 3,
        nama: "Tunjangan Makan",
        tipe: "Pendapatan",
        isMandatory: false
      },
      {
        id: 4,
        nama: "Tunjangan Jabatan",
        tipe: "Pendapatan",
        isMandatory: false
      },
      {
        id: 5,
        nama: "BPJS Kesehatan",
        tipe: "Potongan",
        isMandatory: true
      },
      {
        id: 6,
        nama: "BPJS Ketenagakerjaan",
        tipe: "Potongan",
        isMandatory: true
      },
      {
        id: 7,
        nama: "Bonus Kinerja",
        tipe: "Pendapatan",
        isMandatory: false
      },
      {
        id: 8,
        nama: "Potongan Keterlambatan",
        tipe: "Potongan",
        isMandatory: false
      }
    ],
    generatedPayrolls: [
      {
        id: 1,
        periode: "Maret 2025",
        tanggalGenerate: "2025-03-20",
        status: "Pending Approval",
        jumlahPegawai: 5,
        totalGaji: 50000000
      },
      {
        id: 2,
        periode: "Februari 2025",
        tanggalGenerate: "2025-02-20",
        status: "Approved",
        jumlahPegawai: 5,
        totalGaji: 49500000
      },
      {
        id: 3,
        periode: "Januari 2025",
        tanggalGenerate: "2025-01-20",
        status: "Approved",
        jumlahPegawai: 5,
        totalGaji: 49000000
      }
    ],
    departemenList: ["IT", "HR", "Finance", "Marketing", "Operations", "Sales"],
    jabatanList: ["Manager", "Supervisor", "Staff", "Director", "Developer", "HR Specialist", "Finance Manager", "Marketing Specialist"]
  }),
  actions: {
    // Data Pegawai actions
    addPegawai(pegawai: { id?: number; nama: string; jabatan: string; departemen: string; tanggalBergabung: string; status: string }) {
      const newId = this.pegawaiList.length > 0 ? Math.max(...this.pegawaiList.map(p => p.id)) + 1 : 1;
      this.pegawaiList.push({ ...pegawai, id: newId });
    },
    updatePegawai(pegawai: { id: number; nama: string; jabatan: string; departemen: string; tanggalBergabung: string; status: string }) {
      const index = this.pegawaiList.findIndex(p => p.id === pegawai.id);
      if (index !== -1) {
        this.pegawaiList[index] = { ...pegawai };
      }
    },
    deletePegawai(id: number) {
      this.pegawaiList = this.pegawaiList.filter(p => p.id !== id);
    },
    getPegawaiById(id: number) {
      return this.pegawaiList.find(p => p.id === id);
    },
    
    // Data Pegawai Payroll actions
    addPegawaiPayroll(payroll: { id?: number; pegawaiId: number; gajiPokok: number; tunjangan: number; potongan: number; totalGaji: number }) {
      const newId = this.pegawaiPayrollList.length > 0 ? Math.max(...this.pegawaiPayrollList.map(p => p.id)) + 1 : 1;
      this.pegawaiPayrollList.push({ ...payroll, id: newId });
    },
    updatePegawaiPayroll(payroll: { id: number; pegawaiId: number; gajiPokok: number; tunjangan: number; potongan: number; totalGaji: number }) {
      const index = this.pegawaiPayrollList.findIndex(p => p.id === payroll.id);
      if (index !== -1) {
        this.pegawaiPayrollList[index] = { ...payroll };
      }
    },
    deletePegawaiPayroll(id: number) {
      this.pegawaiPayrollList = this.pegawaiPayrollList.filter(p => p.id !== id);
    },
    getPegawaiPayrollById(id: number) {
      return this.pegawaiPayrollList.find(p => p.id === id);
    },
    
    // Template Payroll actions
    addTemplatePayroll(template: { id?: number; nama: string; deskripsi: string; komponenGaji: string[] }) {
      const newId = this.templatePayroll.length > 0 ? Math.max(...this.templatePayroll.map(t => t.id)) + 1 : 1;
      this.templatePayroll.push({ ...template, id: newId });
    },
    updateTemplatePayroll(template: { id: number; nama: string; deskripsi: string; komponenGaji: string[] }) {
      const index = this.templatePayroll.findIndex(t => t.id === template.id);
      if (index !== -1) {
        this.templatePayroll[index] = { ...template };
      }
    },
    deleteTemplatePayroll(id: number) {
      this.templatePayroll = this.templatePayroll.filter(t => t.id !== id);
    },
    
    // Payroll Komponen actions
    addPayrollKomponen(komponen: { id?: number; nama: string; tipe: string; isMandatory: boolean }) {
      const newId = this.payrollKomponen.length > 0 ? Math.max(...this.payrollKomponen.map(k => k.id)) + 1 : 1;
      this.payrollKomponen.push({ ...komponen, id: newId });
    },
    updatePayrollKomponen(komponen: { id: number; nama: string; tipe: string; isMandatory: boolean }) {
      const index = this.payrollKomponen.findIndex(k => k.id === komponen.id);
      if (index !== -1) {
        this.payrollKomponen[index] = { ...komponen };
      }
    },
    deletePayrollKomponen(id: number) {
      this.payrollKomponen = this.payrollKomponen.filter(k => k.id !== id);
    },
    
    // Generated Payroll actions
    addGeneratedPayroll(payroll: { id?: number; periode: string; tanggalGenerate: string; status: string; jumlahPegawai: number; totalGaji: number }) {
      const newId = this.generatedPayrolls.length > 0 ? Math.max(...this.generatedPayrolls.map(p => p.id)) + 1 : 1;
      this.generatedPayrolls.push({ ...payroll, id: newId });
    },
    updateGeneratedPayrollStatus(id: number, status: string) {
      const index = this.generatedPayrolls.findIndex(p => p.id === id);
      if (index !== -1) {
        this.generatedPayrolls[index].status = status;
      }
    }
  }
});