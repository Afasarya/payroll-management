<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" headerTitle="true" title="Cetak Slip Gaji" cardhaderClass="card-no-border">
                    <div class="card-body">
                        <form @submit.prevent="previewSlipGaji">
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label for="periode" class="form-label">Periode <span class="text-danger">*</span></label>
                                    <select class="form-select" id="periode" v-model="formData.periode" required @change="fetchPayrollData">
                                        <option value="" disabled>Pilih Periode</option>
                                        <option v-for="payroll in pegawaiStore.generatedPayrolls.filter(p => p.status === 'Approved')" 
                                                :key="payroll.id" 
                                                :value="payroll.id">
                                            {{ payroll.periode }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label for="pegawaiId" class="form-label">Pegawai <span class="text-danger">*</span></label>
                                    <select class="form-select" id="pegawaiId" v-model="formData.pegawaiId" required :disabled="!formData.periode">
                                        <option value="" disabled>Pilih Pegawai</option>
                                        <option v-for="pegawai in activePegawai" :key="pegawai.id" :value="pegawai.id">
                                            {{ pegawai.nama }} - {{ pegawai.departemen }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mt-4">
                                <button type="submit" class="btn btn-primary" :disabled="!formData.periode || !formData.pegawaiId">
                                    <i class="fa fa-print me-2"></i>Preview Slip Gaji
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
                <Card3 colClass="col-sm-12" headerTitle="true" title="Preview Slip Gaji" cardhaderClass="card-no-border" id="slipGajiPrint">
                    <div class="card-body">
                        <div class="slip-gaji-container">
                            <!-- Header -->
                            <div class="row mb-4 border-bottom pb-4">
                                <div class="col-md-6">
                                    <h4 class="fw-bold">PT. COMPANY NAME</h4>
                                    <p>Jl. Alamat Perusahaan No. 123<br>
                                    Jakarta, Indonesia<br>
                                    Telp: (021) 1234-5678</p>
                                </div>
                                <div class="col-md-6 text-end">
                                    <h4 class="fw-bold">SLIP GAJI</h4>
                                    <p>Periode: {{ selectedPayroll ? selectedPayroll.periode : '-' }}</p>
                                </div>
                            </div>

                            <!-- Employee Info -->
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <table class="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <td width="40%">Nama</td>
                                                <td>: {{ selectedPegawai ? selectedPegawai.nama : '-' }}</td>
                                            </tr>
                                            <tr>
                                                <td>Jabatan</td>
                                                <td>: {{ selectedPegawai ? selectedPegawai.jabatan : '-' }}</td>
                                            </tr>
                                            <tr>
                                                <td>Departemen</td>
                                                <td>: {{ selectedPegawai ? selectedPegawai.departemen : '-' }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="col-md-6 text-end">
                                    <p>Tanggal: {{ formatDate(new Date()) }}</p>
                                </div>
                            </div>

                            <!-- Salary Details -->
                            <div class="row mb-4">
                                <div class="col-md-12">
                                    <h5 class="fw-bold border-bottom pb-2">Rincian Gaji</h5>
                                    
                                    <div class="row mt-3">
                                        <div class="col-md-6">
                                            <h6 class="fw-bold">Pendapatan</h6>
                                            <table class="table">
                                                <tbody>
                                                    <tr>
                                                        <td>Gaji Pokok</td>
                                                        <td class="text-end">Rp {{ formatCurrency(selectedPayrollData ? selectedPayrollData.gajiPokok : 0) }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tunjangan</td>
                                                        <td class="text-end">Rp {{ formatCurrency(selectedPayrollData ? selectedPayrollData.tunjangan : 0) }}</td>
                                                    </tr>
                                                    <tr class="fw-bold border-top">
                                                        <td>Total Pendapatan</td>
                                                        <td class="text-end">
                                                            Rp {{ formatCurrency(calculateTotalPendapatan()) }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        
                                        <div class="col-md-6">
                                            <h6 class="fw-bold">Potongan</h6>
                                            <table class="table">
                                                <tbody>
                                                    <tr>
                                                        <td>Potongan</td>
                                                        <td class="text-end">Rp {{ formatCurrency(selectedPayrollData ? selectedPayrollData.potongan : 0) }}</td>
                                                    </tr>
                                                    <tr class="fw-bold border-top">
                                                        <td>Total Potongan</td>
                                                        <td class="text-end">
                                                            Rp {{ formatCurrency(selectedPayrollData ? selectedPayrollData.potongan : 0) }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Total -->
                            <div class="row mb-5">
                                <div class="col-md-12">
                                    <table class="table table-bordered">
                                        <tbody>
                                            <tr class="bg-light">
                                                <td width="60%" class="fw-bold">Total Gaji Bersih</td>
                                                <td width="40%" class="text-end fw-bold">
                                                    Rp {{ formatCurrency(selectedPayrollData ? selectedPayrollData.totalGaji : 0) }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div class="row mt-5">
                                <div class="col-md-8"></div>
                                <div class="col-md-4 text-center">
                                    <p>Jakarta, {{ formatDate(new Date()) }}</p>
                                    <p class="mt-5">________________</p>
                                    <p>HR & Finance Manager</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card3>

                <div class="d-flex justify-content-end mt-3 mb-5">
                    <button class="btn btn-secondary me-2" @click="showPreview = false">Tutup</button>
                    <button class="btn btn-primary" @click="printSlipGaji">
                        <i class="fa fa-print me-2"></i>Cetak Slip Gaji
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent, computed, watch } from 'vue'
import { usePegawaiStore } from "@/store/pegawai"

const Card3 = defineAsyncComponent(() => import("@/components/common/card/CardData3.vue"))

const pegawaiStore = usePegawaiStore()
const formData = ref({
    periode: '',
    pegawaiId: ''
})
const showPreview = ref(false)
const selectedPayroll = ref<{ id: number; periode: string } | null>(null)
const selectedPegawai = ref<{ nama: string; jabatan: string; departemen: string } | null>(null)
const selectedPayrollData = ref<{ gajiPokok: number; tunjangan: number; potongan: number; totalGaji: number } | null>(null)
const activePegawai = ref<any[]>([])

// Watch for period changes to filter employees
watch(() => formData.value.periode, (newPeriodeId) => {
    if (newPeriodeId) {
        activePegawai.value = pegawaiStore.pegawaiList.filter(p => p.status === 'Aktif')
        // Reset employee selection
        formData.value.pegawaiId = ''
    }
})

function fetchPayrollData() {
    if (formData.value.periode) {
        const payrollId = parseInt(formData.value.periode)
        selectedPayroll.value = pegawaiStore.generatedPayrolls.find(p => p.id === payrollId) ?? null
    }
}

function previewSlipGaji() {
    if (formData.value.periode && formData.value.pegawaiId) {
        const payrollId = parseInt(formData.value.periode)
        const pegawaiId = parseInt(formData.value.pegawaiId)
        
        selectedPayroll.value = pegawaiStore.generatedPayrolls.find(p => p.id === payrollId) ?? null
        selectedPegawai.value = pegawaiStore.getPegawaiById(pegawaiId) ?? null
        
        // Get payroll data for selected employee
        selectedPayrollData.value = pegawaiStore.pegawaiPayrollList.find(p => p.pegawaiId === pegawaiId) ?? null
        
        if (selectedPayroll.value && selectedPegawai.value && selectedPayrollData.value) {
            showPreview.value = true
        } else {
            alert('Data tidak ditemukan.')
        }
    }
}

function calculateTotalPendapatan() {
    if (selectedPayrollData.value) {
        return selectedPayrollData.value.gajiPokok + selectedPayrollData.value.tunjangan
    }
    return 0
}

function formatDate(dateInput: Date | string): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID').format(value)
}

function printSlipGaji() {
    const slipGajiPrint = document.getElementById('slipGajiPrint')
    if (!slipGajiPrint) return
    const printContent = slipGajiPrint.innerHTML
    const originalContent = document.body.innerHTML
    
    document.body.innerHTML = `
        <html>
            <head>
                <title>Slip Gaji - ${selectedPegawai.value?.nama || ''}</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 8px; }
                    .text-end { text-align: right; }
                    .fw-bold { font-weight: bold; }
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
.slip-gaji-container {
    padding: 20px;
    background-color: white;
}
</style>