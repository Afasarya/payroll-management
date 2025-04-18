<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" headerTitle="true" :title="isEditMode ? 'Edit Data Payroll Pegawai' : 'Tambah Data Payroll Pegawai'" cardhaderClass="card-no-border">
                    <div class="card-body">
                        <form @submit.prevent="savePayroll">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="pegawaiId" class="form-label">Pegawai <span class="text-danger">*</span></label>
                                    <select class="form-select" id="pegawaiId" v-model="formData.pegawaiId" required :disabled="isEditMode">
                                        <option value="" disabled>Pilih Pegawai</option>
                                        <option v-for="pegawai in availablePegawai" :key="pegawai.id" :value="pegawai.id">
                                            {{ pegawai.nama }} - {{ pegawai.departemen }} ({{ pegawai.jabatan }})
                                        </option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="row" v-if="selectedPegawai">
                                <div class="col-md-12 mb-4">
                                    <div class="alert alert-info">
                                        <h6 class="mb-1">Informasi Pegawai:</h6>
                                        <p class="mb-1">
                                            <strong>Nama:</strong> {{ selectedPegawai.nama }}<br>
                                            <strong>Jabatan:</strong> {{ selectedPegawai.jabatan }}<br>
                                            <strong>Departemen:</strong> {{ selectedPegawai.departemen }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label for="gajiPokok" class="form-label">Gaji Pokok <span class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <span class="input-group-text">Rp</span>
                                        <input type="number" class="form-control" id="gajiPokok" v-model="formData.gajiPokok" required @input="calculateTotal">
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label for="tunjangan" class="form-label">Tunjangan <span class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <span class="input-group-text">Rp</span>
                                        <input type="number" class="form-control" id="tunjangan" v-model="formData.tunjangan" required @input="calculateTotal">
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label for="potongan" class="form-label">Potongan <span class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <span class="input-group-text">Rp</span>
                                        <input type="number" class="form-control" id="potongan" v-model="formData.potongan" required @input="calculateTotal">
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="totalGaji" class="form-label">Total Gaji</label>
                                    <div class="input-group">
                                        <span class="input-group-text">Rp</span>
                                        <input type="number" class="form-control bg-light" id="totalGaji" v-model="formData.totalGaji" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mt-4">
                                <router-link to="/payroll/data-pegawai-payroll" class="btn btn-secondary me-2">Batal</router-link>
                                <button type="submit" class="btn btn-primary">{{ isEditMode ? 'Update' : 'Simpan' }}</button>
                            </div>
                        </form>
                    </div>
                </Card3>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePegawaiStore } from "@/store/pegawai"

const Card3 = defineAsyncComponent(() => import("@/components/common/card/CardData3.vue"))

const route = useRoute()
const router = useRouter()
const pegawaiStore = usePegawaiStore()

const formData = ref({
    id: null as number | null,
    pegawaiId: '' as string,
    gajiPokok: 0,
    tunjangan: 0,
    potongan: 0,
    totalGaji: 0
})

const isEditMode = computed(() => {
    return route.params.id !== undefined
})

// Get only employees that don't have payroll data already (for Add mode)
const availablePegawai = computed(() => {
    if (isEditMode.value) {
        // For edit mode, just return all employees
        return pegawaiStore.pegawaiList
    } else {
        // For add mode, filter out employees that already have payroll data
        return pegawaiStore.pegawaiList.filter(pegawai => {
            return !pegawaiStore.pegawaiPayrollList.some(payroll => payroll.pegawaiId === pegawai.id)
        })
    }
})

const selectedPegawai = computed(() => {
    if (!formData.value.pegawaiId) return null
    return pegawaiStore.getPegawaiById(parseInt(formData.value.pegawaiId))
})

watch(() => formData.value.pegawaiId, (newVal) => {
    if (newVal && !isEditMode.value) {
        // Reset values when employee changes (in add mode)
        formData.value.gajiPokok = 0
        formData.value.tunjangan = 0
        formData.value.potongan = 0
        formData.value.totalGaji = 0
    }
})

onMounted(() => {
    if (isEditMode.value) {
        const payrollId = parseInt(route.params.id as string)
        const payroll = pegawaiStore.getPegawaiPayrollById(payrollId)
        
        if (payroll) {
                    formData.value = { 
                        ...payroll,
                        pegawaiId: payroll.pegawaiId.toString() 
                    }
                } else {
                    // Handle case when payroll data is not found
                    router.push('/payroll/data-pegawai-payroll')
                }
    }
})

function calculateTotal() {
    const gajiPokok = parseInt(formData.value.gajiPokok.toString()) || 0
    const tunjangan = parseInt(formData.value.tunjangan.toString()) || 0
    const potongan = parseInt(formData.value.potongan.toString()) || 0
    
    formData.value.totalGaji = gajiPokok + tunjangan - potongan
}

function savePayroll() {
    if (isEditMode.value) {
        pegawaiStore.updatePegawaiPayroll({
            ...formData.value,
            id: formData.value.id as number,
            pegawaiId: parseInt(formData.value.pegawaiId)
        })
    } else {
        pegawaiStore.addPegawaiPayroll({
            ...formData.value,
            id: formData.value.id === null ? undefined : formData.value.id,
            pegawaiId: parseInt(formData.value.pegawaiId)
        })
    }
    
    router.push('/payroll/data-pegawai-payroll')
}
</script>