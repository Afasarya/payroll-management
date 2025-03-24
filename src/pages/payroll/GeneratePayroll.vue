<template>
    <div class="container-fluid">
        <!-- Generate Form Section -->
        <div class="row" v-if="!isPreviewMode">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" headerTitle="true" title="Generate Payroll" cardhaderClass="card-no-border">
                    <div class="card-body">
                        <form @submit.prevent="previewPayroll">
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
                                <button type="submit" class="btn btn-primary">Preview Payroll</button>
                            </div>
                        </form>
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
                                        <td>Rp {{ formatCurrency(item.payroll.gajiPokok) }}</td>
                                        <td>Rp {{ formatCurrency(item.payroll.tunjangan) }}</td>
                                        <td>Rp {{ formatCurrency(item.payroll.potongan) }}</td>
                                        <td>Rp {{ formatCurrency(item.payroll.totalGaji) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="d-flex justify-content-end mt-4">
                            <button type="button" class="btn btn-secondary me-2" @click="cancelPreview">Batal</button>
                            <button type="button" class="btn btn-primary" @click="generatePayroll">Generate Payroll</button>
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
import { ref, defineAsyncComponent, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePegawaiStore } from "@/store/pegawai"

const Card3 = defineAsyncComponent(() => import("@/components/common/card/CardData3.vue"))

const router = useRouter()
const pegawaiStore = usePegawaiStore()

const isPreviewMode = ref(false)
const formData = ref({
    periode: '',
    templateId: ''
})
const pegawaiWithPayroll = ref<Array<{ pegawai: any; payroll: any }>>([])
const currentYear = new Date().getFullYear()

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

onMounted(() => {
    // Sort generatedPayrolls by latest first
    pegawaiStore.generatedPayrolls.sort((a, b) => {
        return new Date(b.tanggalGenerate).getTime() - new Date(a.tanggalGenerate).getTime()
    })
})

function previewPayroll() {
    // Get all employees with payroll data
    pegawaiWithPayroll.value = pegawaiStore.pegawaiPayrollList.map(payroll => {
        const pegawai = pegawaiStore.getPegawaiById(payroll.pegawaiId)
        return {
            pegawai,
            payroll
        }
    }).filter(item => item.pegawai && item.pegawai.status === 'Aktif')
    
    isPreviewMode.value = true
}

function cancelPreview() {
    isPreviewMode.value = false
    pegawaiWithPayroll.value = []
}

function calculateTotalPayroll() {
    return pegawaiWithPayroll.value.reduce((total, item) => {
        return total + item.payroll.totalGaji
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
    
    // Show success message or redirect to approval page
    alert('Payroll berhasil digenerate dan menunggu approval.')
}

function formatDate(dateString: string | Date) {
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
</script>