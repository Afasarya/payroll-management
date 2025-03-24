<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" headerTitle="true" title="Cetak Laporan Gaji" cardhaderClass="card-no-border">
                    <div class="card-body">
                        <form @submit.prevent="generateReport">
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label for="jenis" class="form-label">Jenis Laporan <span class="text-danger">*</span></label>
                                    <select class="form-select" id="jenis" v-model="formData.jenis" required>
                                        <option value="" disabled>Pilih Jenis Laporan</option>
                                        <option value="bulanan">Laporan Bulanan</option>
                                        <option value="departemen">Laporan Per Departemen</option>
                                        <option value="rekap">Rekap Tahunan</option>
                                    </select>
                                </div>
                                
                                <!-- Filter options for monthly report -->
                                <div class="col-md-4 mb-3" v-if="formData.jenis === 'bulanan'">
                                    <label for="periode" class="form-label">Periode <span class="text-danger">*</span></label>
                                    <select class="form-select" id="periode" v-model="formData.periode" required>
                                        <option value="" disabled>Pilih Periode</option>
                                        <option v-for="payroll in pegawaiStore.generatedPayrolls.filter(p => p.status === 'Approved')" 
                                                :key="payroll.id" 
                                                :value="payroll.id">
                                            {{ payroll.periode }}
                                        </option>
                                    </select>
                                </div>
                                
                                <!-- Filter options for department report -->
                                <div class="col-md-4 mb-3" v-if="formData.jenis === 'departemen'">
                                    <label for="periode" class="form-label">Periode <span class="text-danger">*</span></label>
                                    <select class="form-select" id="periode" v-model="formData.periode" required>
                                        <option value="" disabled>Pilih Periode</option>
                                        <option v-for="payroll in pegawaiStore.generatedPayrolls.filter(p => p.status === 'Approved')" 
                                                :key="payroll.id" 
                                                :value="payroll.id">
                                            {{ payroll.periode }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-4 mb-3" v-if="formData.jenis === 'departemen'">
                                    <label for="departemen" class="form-label">Departemen <span class="text-danger">*</span></label>
                                    <select class="form-select" id="departemen" v-model="formData.departemen" required>
                                        <option value="" disabled>Pilih Departemen</option>
                                        <option v-for="dept in pegawaiStore.departemenList" :key="dept" :value="dept">
                                            {{ dept }}
                                        </option>
                                    </select>
                                </div>
                                
                                <!-- Filter options for yearly report -->
                                <div class="col-md-4 mb-3" v-if="formData.jenis === 'rekap'">
                                    <label for="tahun" class="form-label">Tahun <span class="text-danger">*</span></label>
                                    <select class="form-select" id="tahun" v-model="formData.tahun" required>
                                        <option value="" disabled>Pilih Tahun</option>
                                        <option value="2025">2025</option>
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                    </select>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mt-4">
                                <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
                                    <i class="fa fa-file-pdf me-2"></i>Generate Laporan
                                </button>
                            </div>
                        </form>
                    </div>
                </Card3>
            </div>
        </div>

        <!-- Preview Section -->
        <div class="row mt-4" v-if="showPreview">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" headerTitle="true" :title="reportTitle" cardhaderClass="card-no-border" id="laporanGajiPrint">
                    <div class="card-body">
                        <div class="laporan-container">
                            <!-- Header -->
                            <div class="row mb-4 border-bottom pb-4">
                                <div class="col-md-6">
                                    <h4 class="fw-bold">PT. COMPANY NAME</h4>
                                    <p>Jl. Alamat Perusahaan No. 123<br>
                                    Jakarta, Indonesia<br>
                                    Telp: (021) 1234-5678</p>
                                </div>
                                <div class="col-md-6 text-end">
                                    <h4 class="fw-bold">{{ reportTitle }}</h4>
                                    <p v-if="selectedPayroll">Periode: {{ selectedPayroll.periode }}</p>
                                    <p v-if="formData.jenis === 'departemen'">Departemen: {{ formData.departemen }}</p>
                                    <p v-if="formData.jenis === 'rekap'">Tahun: {{ formData.tahun }}</p>
                                </div>
                            </div>

                            <!-- Report Content -->
                            <!-- Monthly Report -->
                            <div v-if="formData.jenis === 'bulanan'">
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr class="bg-light">
                                                <th>No</th>
                                                <th>Nama Pegawai</th>
                                                <th>Departemen</th>
                                                <th>Jabatan</th>
                                                <th>Gaji Pokok</th>
                                                <th>Tunjangan</th>
                                                <th>Potongan</th>
                                                <th>Total Gaji</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in reportData" :key="index">
                                                <td>{{ index + 1 }}</td>
                                                <td>{{ item.pegawai.nama }}</td>
                                                <td>{{ item.pegawai.departemen }}</td>
                                                <td>{{ item.pegawai.jabatan }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(item.payroll.gajiPokok) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(item.payroll.tunjangan) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(item.payroll.potongan) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(item.payroll.totalGaji) }}</td>
                                            </tr>
                                            <tr class="fw-bold bg-light">
                                                <td colspan="4" class="text-end">Total</td>
                                                <td class="text-end">Rp {{ formatCurrency(calculateTotal('gajiPokok')) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(calculateTotal('tunjangan')) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(calculateTotal('potongan')) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(calculateTotal('totalGaji')) }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Department Report -->
                            <div v-if="formData.jenis === 'departemen'">
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr class="bg-light">
                                                <th>No</th>
                                                <th>Nama Pegawai</th>
                                                <th>Jabatan</th>
                                                <th>Gaji Pokok</th>
                                                <th>Tunjangan</th>
                                                <th>Potongan</th>
                                                <th>Total Gaji</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in reportData" :key="index">
                                                <td>{{ index + 1 }}</td>
                                                <td>{{ item.pegawai.nama }}</td>
                                                <td>{{ item.pegawai.jabatan }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(item.payroll.gajiPokok) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(item.payroll.tunjangan) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(item.payroll.potongan) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(item.payroll.totalGaji) }}</td>
                                            </tr>
                                            <tr class="fw-bold bg-light">
                                                <td colspan="3" class="text-end">Total {{ formData.departemen }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(calculateTotal('gajiPokok')) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(calculateTotal('tunjangan')) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(calculateTotal('potongan')) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(calculateTotal('totalGaji')) }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Yearly Report -->
                            <div v-if="formData.jenis === 'rekap'">
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr class="bg-light">
                                                <th>No</th>
                                                <th>Bulan</th>
                                                <th>Jumlah Pegawai</th>
                                                <th>Total Gaji Pokok</th>
                                                <th>Total Tunjangan</th>
                                                <th>Total Potongan</th>
                                                <th>Total Gaji</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in yearlyReportData" :key="index">
                                                <td>{{ index + 1 }}</td>
                                                <td>{{ item.bulan }}</td>
                                                <td class="text-center">{{ item.jumlahPegawai }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(item.totalGajiPokok) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(item.totalTunjangan) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(item.totalPotongan) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(item.totalGaji) }}</td>
                                            </tr>
                                            <tr class="fw-bold bg-light">
                                                <td colspan="3" class="text-end">Grand Total {{ formData.tahun }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(calculateYearlyTotal('totalGajiPokok')) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(calculateYearlyTotal('totalTunjangan')) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(calculateYearlyTotal('totalPotongan')) }}</td>
                                                <td class="text-end">Rp {{ formatCurrency(calculateYearlyTotal('totalGaji')) }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div class="row mt-5">
                                <div class="col-md-8"></div>
                                <div class="col-md-4 text-center">
                                    <p>Jakarta, {{ formatDate(new Date().toISOString()) }}</p>
                                    <p class="mt-5">________________</p>
                                    <p>HR & Finance Manager</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card3>

                <div class="d-flex justify-content-end mt-3 mb-5">
                    <button class="btn btn-secondary me-2" @click="showPreview = false">Tutup</button>
                    <button class="btn btn-primary" @click="printReport">
                        <i class="fa fa-print me-2"></i>Cetak Laporan
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent, computed } from 'vue'
import { usePegawaiStore } from "@/store/pegawai"

const Card3 = defineAsyncComponent(() => import("@/components/common/card/CardData3.vue"))

const pegawaiStore = usePegawaiStore()
const formData = ref({
    jenis: '',
    periode: '',
    departemen: '',
    tahun: ''
})
const showPreview = ref(false)
interface Payroll {
    id: number;
    periode: string;
    // include other properties as needed
}
const selectedPayroll = ref<Payroll | null>(null)
interface ReportItem {
    pegawai: any;
    payroll: any;
}

interface YearlyReportItem {
    bulan: string;
    jumlahPegawai: number;
    totalGajiPokok: number;
    totalTunjangan: number;
    totalPotongan: number;
    totalGaji: number;
}

const reportData = ref<ReportItem[]>([])
const yearlyReportData = ref<YearlyReportItem[]>([])

const isFormValid = computed(() => {
    if (formData.value.jenis === 'bulanan') {
        return formData.value.periode !== ''
    } else if (formData.value.jenis === 'departemen') {
        return formData.value.periode !== '' && formData.value.departemen !== ''
    } else if (formData.value.jenis === 'rekap') {
        return formData.value.tahun !== ''
    }
    return false
})

const reportTitle = computed(() => {
    if (formData.value.jenis === 'bulanan') {
        return 'LAPORAN GAJI BULANAN'
    } else if (formData.value.jenis === 'departemen') {
        return 'LAPORAN GAJI PER DEPARTEMEN'
    } else if (formData.value.jenis === 'rekap') {
        return 'REKAP GAJI TAHUNAN'
    }
    return 'LAPORAN GAJI'
})

function generateReport() {
    if (formData.value.jenis === 'bulanan') {
        generateMonthlyReport()
    } else if (formData.value.jenis === 'departemen') {
        generateDepartmentReport()
    } else if (formData.value.jenis === 'rekap') {
        generateYearlyReport()
    }
}

function generateMonthlyReport() {
    const payrollId = parseInt(formData.value.periode)
    selectedPayroll.value = pegawaiStore.generatedPayrolls.find(p => p.id === payrollId) || null
    
    if (selectedPayroll.value) {
        // Generate payroll data for all employees
        reportData.value = pegawaiStore.pegawaiPayrollList.map(payrollItem => {
            const pegawai = pegawaiStore.getPegawaiById(payrollItem.pegawaiId)
            return {
                pegawai,
                payroll: payrollItem
            }
        }).filter(item => item.pegawai && item.pegawai.status === 'Aktif')
        
        showPreview.value = true
    }
}

function generateDepartmentReport() {
    const payrollId = parseInt(formData.value.periode)
    selectedPayroll.value = pegawaiStore.generatedPayrolls.find(p => p.id === payrollId) || null
    
    if (selectedPayroll.value && formData.value.departemen) {
        // Filter employees by department
        reportData.value = pegawaiStore.pegawaiPayrollList.map(payrollItem => {
            const pegawai = pegawaiStore.getPegawaiById(payrollItem.pegawaiId)
            return {
                pegawai,
                payroll: payrollItem
            }
        }).filter(item => 
            item.pegawai && 
            item.pegawai.status === 'Aktif' && 
            item.pegawai.departemen === formData.value.departemen
        )
        
        showPreview.value = true
    }
}

function generateYearlyReport() {
    // Generate mock yearly data for the selected year
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    
    // Clear previous data
    yearlyReportData.value = []
    
    // Generate random data for each month
    const baseEmployeeCount = pegawaiStore.pegawaiList.filter(p => p.status === 'Aktif').length
    let totalYearlyPokok = 0
    let totalYearlyTunjangan = 0
    let totalYearlyPotongan = 0
    
    months.forEach((month, index) => {
        // Some randomness in the numbers for simulation
        const jumlahPegawai = baseEmployeeCount + (index < 6 ? index : 0)
        const multiplier = 1 + (index * 0.01)
        
        const totalGajiPokok = Math.round(8000000 * jumlahPegawai * multiplier)
        const totalTunjangan = Math.round(1500000 * jumlahPegawai * multiplier)
        const totalPotongan = Math.round(400000 * jumlahPegawai * multiplier)
        const totalGaji = totalGajiPokok + totalTunjangan - totalPotongan
        
        totalYearlyPokok += totalGajiPokok
        totalYearlyTunjangan += totalTunjangan
        totalYearlyPotongan += totalPotongan
        
        yearlyReportData.value.push({
            bulan: month,
            jumlahPegawai,
            totalGajiPokok,
            totalTunjangan,
            totalPotongan,
            totalGaji
        })
    })
    
    showPreview.value = true
}

function calculateTotal(field: 'gajiPokok' | 'tunjangan' | 'potongan' | 'totalGaji') {
    return reportData.value.reduce((total, item) => {
        return total + item.payroll[field]
    }, 0)
}

function calculateYearlyTotal(field: 'totalGajiPokok' | 'totalTunjangan' | 'totalPotongan' | 'totalGaji') {
    return yearlyReportData.value.reduce((total, item) => {
        return total + item[field]
    }, 0)
}

function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('id-ID').format(value)
}

function printReport() {
    const printContent = document.getElementById('laporanGajiPrint')!.innerHTML
    const originalContent = document.body.innerHTML
    
    document.body.innerHTML = `
        <html>
            <head>
                <title>${reportTitle.value}</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 8px; border: 1px solid #ddd; }
                    .text-end { text-align: right; }
                    .text-center { text-align: center; }
                    .fw-bold { font-weight: bold; }
                    .bg-light { background-color: #f8f9fa; }
                </style>
            </head>
            <body>
                ${printContent}
            </body>
        </html>
    `
    
    window.print()
    document.body.innerHTML = originalContent
}
</script>

<style scoped>
.laporan-container {
    padding: 20px;
    background-color: white;
}
</style>