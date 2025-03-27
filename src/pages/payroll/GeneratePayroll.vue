<template>
    <div class="container-fluid">
        <!-- Generate Form Section -->
        <div class="row" v-if="!isPreviewMode">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" headerTitle="true" title="Generate Payroll" cardhaderClass="card-no-border">
                    <div class="card-body">
                        <form @submit.prevent="loadEmployeeList">
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label for="periode" class="form-label">Periode <span class="text-danger">*</span></label>
                                    <select class="form-select" id="periode" v-model="formData.periode" required>
                                        <option value="" disabled>Pilih Periode</option>
                                        <option v-for="month in months" :key="month.value" :value="month.name + ' ' + currentYear">
                                            {{ month.name }} {{ currentYear }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label for="templateId" class="form-label">Template Payroll <span class="text-danger">*</span></label>
                                    <select class="form-select" id="templateId" v-model="formData.templateId" required>
                                        <option value="" disabled>Pilih Template</option>
                                        <option v-for="template in pegawaiStore.templatePayroll" :key="template.id" :value="template.id">
                                            {{ template.nama }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="alert alert-info">
                                        <p class="mb-0"><strong>Informasi:</strong> Pastikan data pegawai dan komponen gaji sudah lengkap sebelum generate payroll.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mt-4">
                                <button type="submit" class="btn btn-primary">Lanjutkan</button>
                            </div>
                        </form>
                    </div>
                </Card3>
            </div>
        </div>

        <!-- Employee Selection Section -->
        <div class="row" v-if="isEmployeeSelectionMode">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" headerTitle="true" title="Pilih Pegawai" cardhaderClass="card-no-border">
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="d-flex align-items-center">
                                    <div class="form-check mb-0">
                                        <input class="form-check-input" type="checkbox" id="checkAll" 
                                            v-model="selectAll" @change="toggleSelectAll">
                                        <label class="form-check-label" for="checkAll">
                                            Pilih Semua
                                        </label>
                                    </div>
                                    <span class="ms-3">{{ selectedEmployees.length }} dari {{ availableEmployees.length }} pegawai dipilih</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fa fa-search"></i></span>
                                    <input type="text" class="form-control" placeholder="Cari pegawai..." v-model="searchQuery">
                                </div>
                            </div>
                        </div>

                        <div class="table-responsive theme-scrollbar">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th style="width: 50px;"></th>
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
                                    <tr v-for="(employee, index) in filteredEmployees" :key="index">
                                        <td class="text-center">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" 
                                                    :id="'employee-' + employee.pegawai.id"
                                                    :value="employee.pegawai.id"
                                                    v-model="selectedEmployees">
                                            </div>
                                        </td>
                                        <td>{{ employee.pegawai.nama }}</td>
                                        <td>{{ employee.pegawai.departemen }}</td>
                                        <td>{{ employee.pegawai.jabatan }}</td>
                                        <td>Rp {{ formatCurrency(employee.payroll.gajiPokok) }}</td>
                                        <td>Rp {{ formatCurrency(employee.payroll.tunjangan) }}</td>
                                        <td>Rp {{ formatCurrency(employee.payroll.potongan) }}</td>
                                        <td>Rp {{ formatCurrency(employee.payroll.totalGaji) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="d-flex justify-content-end mt-4">
                            <button type="button" class="btn btn-secondary me-2" @click="cancelEmployeeSelection">Batal</button>
                            <button type="button" class="btn btn-primary" @click="previewPayroll" 
                                :disabled="selectedEmployees.length === 0">
                                Preview Payroll
                            </button>
                        </div>
                    </div>
                </Card3>
            </div>
        </div>

        <!-- Preview Section -->
        <div class="row" v-if="isPreviewMode">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" headerTitle="true" title="Preview Payroll" cardhaderClass="card-no-border">
                    <div class="card-body">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h6>Periode: {{ formData.periode }}</h6>
                                <h6>Template: {{ selectedTemplate?.nama }}</h6>
                                <h6>Tanggal Generate: {{ formatDate(new Date()) }}</h6>
                            </div>
                            <div class="col-md-6 text-end">
                                <h6>Total Pegawai: {{ pegawaiWithPayroll.length }}</h6>
                                <h6>Total Gaji: Rp {{ formatCurrency(calculateTotalPayroll()) }}</h6>
                                <div class="form-check form-switch mt-2">
                                    <input class="form-check-input" type="checkbox" id="editModeSwitch" v-model="isEditMode">
                                    <label class="form-check-label" for="editModeSwitch">Mode Edit</label>
                                </div>
                            </div>
                        </div>

                        <div class="table-responsive theme-scrollbar">
                            <table class="display table dataTable no-footer table-bordered">
                                <thead>
                                    <tr>
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
                                <tbody v-if="!pegawaiWithPayroll.length">
                                    <tr>
                                        <td valign="top" colspan="8" class="dataTables_empty">
                                            No data available</td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-for="(item, index) in pegawaiWithPayroll" :key="index">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ item.pegawai.nama }}</td>
                                        <td>{{ item.pegawai.departemen }}</td>
                                        <td>{{ item.pegawai.jabatan }}</td>
                                        <td>
                                            <div v-if="isEditMode" class="input-group input-group-sm">
                                                <span class="input-group-text">Rp</span>
                                                <input type="number" class="form-control" v-model="item.payroll.gajiPokok" 
                                                    @input="recalculateTotal(item)">
                                            </div>
                                            <span v-else>Rp {{ formatCurrency(item.payroll.gajiPokok) }}</span>
                                        </td>
                                        <td>
                                            <div v-if="isEditMode" class="input-group input-group-sm">
                                                <span class="input-group-text">Rp</span>
                                                <input type="number" class="form-control" v-model="item.payroll.tunjangan" 
                                                    @input="recalculateTotal(item)">
                                            </div>
                                            <span v-else>Rp {{ formatCurrency(item.payroll.tunjangan) }}</span>
                                        </td>
                                        <td>
                                            <div v-if="isEditMode" class="input-group input-group-sm">
                                                <span class="input-group-text">Rp</span>
                                                <input type="number" class="form-control" v-model="item.payroll.potongan" 
                                                    @input="recalculateTotal(item)">
                                            </div>
                                            <span v-else>Rp {{ formatCurrency(item.payroll.potongan) }}</span>
                                        </td>
                                        <td>
                                            <span class="fw-bold">Rp {{ formatCurrency(item.payroll.totalGaji) }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="d-flex justify-content-end mt-4">
                            <button type="button" class="btn btn-secondary me-2" @click="isEditMode ? cancelEdit() : cancelPreview()">
                                {{ isEditMode ? 'Batal Edit' : 'Batal' }}
                            </button>
                            <button type="button" class="btn btn-success me-2" v-if="isEditMode" @click="saveEdit">
                                Simpan Perubahan
                            </button>
                            <button type="button" class="btn btn-primary" @click="generatePayroll" :disabled="isEditMode">
                                Generate Payroll
                            </button>
                        </div>
                    </div>
                </Card3>
            </div>
        </div>

        <!-- Payroll History Section -->
        <div class="row mt-4">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" table="true" headerTitle="true" title="Riwayat Generate Payroll" cardhaderClass="card-no-border">
                    <div class="table-responsive theme-scrollbar">
                        <table class="display table dataTable no-footer table-bordered">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Periode</th>
                                    <th>Tanggal Generate</th>
                                    <th>Jumlah Pegawai</th>
                                    <th>Total Gaji</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody v-if="!pegawaiStore.generatedPayrolls.length">
                                <tr>
                                    <td valign="top" colspan="6" class="dataTables_empty">
                                        No records found</td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr v-for="(payroll, index) in pegawaiStore.generatedPayrolls" :key="payroll.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ payroll.periode }}</td>
                                    <td>{{ formatDate(payroll.tanggalGenerate) }}</td>
                                    <td>{{ payroll.jumlahPegawai }}</td>
                                    <td>Rp {{ formatCurrency(payroll.totalGaji) }}</td>
                                    <td>
                                        <span class="badge" 
                                            :class="payroll.status === 'Approved' ? 'bg-success' : 'bg-warning'">
                                            {{ payroll.status }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card3>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePegawaiStore } from "@/store/pegawai"

interface EmployeePayroll {
    pegawai: {
         id: number,
         nama: string,
         departemen: string,
         jabatan: string,
         status: string
    },
    payroll: {
         gajiPokok: number,
         tunjangan: number,
         potongan: number,
         totalGaji: number
    }
}

// Employee selection
const availableEmployees = ref<EmployeePayroll[]>([])
const selectedEmployees = ref<number[]>([])
const pegawaiStore = usePegawaiStore()

// Mode states
const isPreviewMode = ref(false)
const isEmployeeSelectionMode = ref(false)
const isEditMode = ref(false)

// Form data
const formData = ref({
    periode: '',
    templateId: ''
})

const searchQuery = ref('')
const selectAll = ref(false)

// Preview data
const originalPayrollData = ref([]) // For storing original data during edit mode
const currentYear = new Date().getFullYear()
const pegawaiWithPayroll = ref<EmployeePayroll[]>([])
const months = [
    { name: 'Januari', value: 0 },
    { name: 'Februari', value: 1 },
    { name: 'Maret', value: 2 },
    { name: 'April', value: 3 },
    { name: 'Mei', value: 4 },
    { name: 'Juni', value: 5 },
    { name: 'Juli', value: 6 },
    { name: 'Agustus', value: 7 },
    { name: 'September', value: 8 },
    { name: 'Oktober', value: 9 },
    { name: 'November', value: 10 },
    { name: 'Desember', value: 11 }
]

const selectedTemplate = computed(() => {
    if (!formData.value.templateId) return null
    return pegawaiStore.templatePayroll.find(t => t.id === parseInt(formData.value.templateId))
})

const filteredEmployees = computed(() => {
    if (!searchQuery.value) return availableEmployees.value
    
    const query = searchQuery.value.toLowerCase()
    return availableEmployees.value.filter(item => {
        return (
            item.pegawai.nama.toLowerCase().includes(query) ||
            item.pegawai.departemen.toLowerCase().includes(query) ||
            item.pegawai.jabatan.toLowerCase().includes(query)
        )
    })
})

watch(isEditMode, (newValue) => {
    if (newValue) {
        // Save original data for cancel operation
        originalPayrollData.value = JSON.parse(JSON.stringify(pegawaiWithPayroll.value))
    }
})

onMounted(() => {
    // Sort generatedPayrolls by latest first
    pegawaiStore.generatedPayrolls.sort((a, b) => {
        return new Date(b.tanggalGenerate).getTime() - new Date(a.tanggalGenerate).getTime()
    })
})

function loadEmployeeList() {
    // Get all employees with payroll data, filtering out undefined pegawai
    availableEmployees.value = pegawaiStore.pegawaiPayrollList
        .map(payroll => {
            const pegawai = pegawaiStore.getPegawaiById(payroll.pegawaiId)
            if (!pegawai) return null;
            return {
                pegawai,
                payroll: { ...payroll } // Create a copy to avoid modifying the original
            }
        })
        .filter(item => item !== null && item.pegawai.status === 'Aktif') as EmployeePayroll[];
    
    // Clear previous selections
    selectedEmployees.value = []
    selectAll.value = false
    
    // Show employee selection mode
    isEmployeeSelectionMode.value = true
}

function toggleSelectAll() {
    if (selectAll.value) {
        selectedEmployees.value = availableEmployees.value.map(item => item.pegawai.id)
    } else {
        selectedEmployees.value = []
    }
}

function cancelEmployeeSelection() {
    isEmployeeSelectionMode.value = false
    availableEmployees.value = []
    selectedEmployees.value = []
}

function previewPayroll() {
    // Filter to include only selected employees
    pegawaiWithPayroll.value = availableEmployees.value.filter(item => 
        selectedEmployees.value.includes(item.pegawai.id)
    )
    
    // Switch modes
    isEmployeeSelectionMode.value = false
    isPreviewMode.value = true
}

function cancelPreview() {
    isPreviewMode.value = false
    isEmployeeSelectionMode.value = true
    pegawaiWithPayroll.value = []
}

function cancelEdit() {
    // Restore original data
    pegawaiWithPayroll.value = JSON.parse(JSON.stringify(originalPayrollData.value))
    isEditMode.value = false
}

function saveEdit() {
    // Save changes and exit edit mode
    originalPayrollData.value = JSON.parse(JSON.stringify(pegawaiWithPayroll.value))
    isEditMode.value = false
}

function recalculateTotal(item: EmployeePayroll) {
    // Ensure values are numbers
    const gajiPokok = Number(item.payroll.gajiPokok) || 0
    const tunjangan = Number(item.payroll.tunjangan) || 0
    const potongan = Number(item.payroll.potongan) || 0
    
    // Calculate total
    item.payroll.totalGaji = gajiPokok + tunjangan - potongan
}

function calculateTotalPayroll() {
    return pegawaiWithPayroll.value.reduce((total, item) => {
        return total + Number(item.payroll.totalGaji)
    }, 0)
}

function generatePayroll() {
    const totalGaji = calculateTotalPayroll()
    
    // Create new payroll record
    const newPayroll = {
        periode: formData.value.periode,
        tanggalGenerate: new Date().toISOString().split('T')[0],
        status: 'Pending Approval',
        jumlahPegawai: pegawaiWithPayroll.value.length,
        totalGaji
    }
    
    pegawaiStore.addGeneratedPayroll(newPayroll)
    
    // Reset form and go back to generate mode
    isPreviewMode.value = false
    formData.value = {
        periode: '',
        templateId: ''
    }
    
    // Show success message
    alert('Payroll berhasil digenerate dan menunggu approval.')
}

function formatDate(date: string | Date) {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return parsedDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('id-ID').format(value)
}
</script>

<style scoped>
.form-check-input[type="checkbox"] {
    cursor: pointer;
}
</style>