<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" headerTitle="true" :title="isEditMode ? 'Edit Template Payroll' : 'Tambah Template Payroll'" cardhaderClass="card-no-border">
                    <div class="card-body">
                        <form @submit.prevent="saveTemplate">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="nama" class="form-label">Nama Template <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="nama" v-model="formData.nama" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="deskripsi" class="form-label">Deskripsi <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="deskripsi" v-model="formData.deskripsi" required>
                                </div>
                            </div>
                            
                            <div class="row mt-3">
                                <div class="col-md-12">
                                    <label class="form-label">Komponen Gaji <span class="text-danger">*</span></label>
                                    
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="card border mb-3">
                                                <div class="card-header bg-light">
                                                    <h6 class="mb-0">Komponen Pendapatan</h6>
                                                </div>
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="col-md-12" v-for="komponen in pendapatanKomponen" :key="komponen.id">
                                                            <div class="form-check mb-2">
                                                                <input 
                                                                    class="form-check-input" 
                                                                    type="checkbox" 
                                                                    :id="`komponen-${komponen.id}`"
                                                                    :value="komponen.nama"
                                                                    v-model="formData.komponenGaji"
                                                                    :disabled="komponen.isMandatory"
                                                                    :checked="komponen.isMandatory || formData.komponenGaji.includes(komponen.nama)"
                                                                >
                                                                <label class="form-check-label" :for="`komponen-${komponen.id}`">
                                                                    {{ komponen.nama }}
                                                                    <span class="badge bg-info ms-1" v-if="komponen.isMandatory">Wajib</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="col-md-6">
                                            <div class="card border mb-3">
                                                <div class="card-header bg-light">
                                                    <h6 class="mb-0">Komponen Potongan</h6>
                                                </div>
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="col-md-12" v-for="komponen in potonganKomponen" :key="komponen.id">
                                                            <div class="form-check mb-2">
                                                                <input 
                                                                    class="form-check-input" 
                                                                    type="checkbox" 
                                                                    :id="`komponen-${komponen.id}`"
                                                                    :value="komponen.nama"
                                                                    v-model="formData.komponenGaji"
                                                                    :disabled="komponen.isMandatory"
                                                                    :checked="komponen.isMandatory || formData.komponenGaji.includes(komponen.nama)"
                                                                >
                                                                <label class="form-check-label" :for="`komponen-${komponen.id}`">
                                                                    {{ komponen.nama }}
                                                                    <span class="badge bg-info ms-1" v-if="komponen.isMandatory">Wajib</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="d-flex justify-content-end mt-4">
                                <router-link to="/payroll/template-payroll" class="btn btn-secondary me-2">Batal</router-link>
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
import { ref, defineAsyncComponent, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePegawaiStore } from "@/store/pegawai"

const Card3 = defineAsyncComponent(() => import("@/components/common/card/CardData3.vue"))

const route = useRoute()
const router = useRouter()
const pegawaiStore = usePegawaiStore()

const formData = ref({
    id: null as number | null,
    nama: '',
    deskripsi: '',
    komponenGaji: [] as string[]
})

const isEditMode = computed(() => {
    return route.params.id !== undefined
})

const pendapatanKomponen = computed(() => {
    return pegawaiStore.payrollKomponen.filter(k => k.tipe === 'Pendapatan')
})

const potonganKomponen = computed(() => {
    return pegawaiStore.payrollKomponen.filter(k => k.tipe === 'Potongan')
})

onMounted(() => {
    // Initialize with mandatory components
    const mandatoryComponents = pegawaiStore.payrollKomponen
        .filter(k => k.isMandatory)
        .map(k => k.nama)
    
    formData.value.komponenGaji = [...mandatoryComponents]
    
    if (isEditMode.value) {
        const templateId = parseInt(route.params.id as string)
        const template = pegawaiStore.templatePayroll.find(t => t.id === templateId)
        
        if (template) {
            formData.value = { ...template }
        } else {
            // Handle case when template is not found
            router.push('/payroll/template-payroll')
        }
    }
})

function saveTemplate() {
    if (isEditMode.value) {
        pegawaiStore.updateTemplatePayroll({ ...formData.value, id: formData.value.id! })
    } else {
        const { id, ...payload } = formData.value;
        pegawaiStore.addTemplatePayroll(payload)
    }
    
    router.push('/payroll/template-payroll')
}
</script>