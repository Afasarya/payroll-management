<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" headerTitle="true" :title="isEditMode ? 'Edit Komponen Payroll' : 'Tambah Komponen Payroll'" cardhaderClass="card-no-border">
                    <div class="card-body">
                        <form @submit.prevent="saveKomponen">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="nama" class="form-label">Nama Komponen <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="nama" v-model="formData.nama" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="tipe" class="form-label">Tipe Komponen <span class="text-danger">*</span></label>
                                    <select class="form-select" id="tipe" v-model="formData.tipe" required>
                                        <option value="" disabled>Pilih Tipe</option>
                                        <option value="Pendapatan">Pendapatan</option>
                                        <option value="Potongan">Potongan</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <div class="form-check mt-4">
                                        <input class="form-check-input" type="checkbox" id="isMandatory" v-model="formData.isMandatory" 
                                            :disabled="isEditMode && originalIsMandatory">
                                        <label class="form-check-label" for="isMandatory">
                                            Komponen Wajib
                                        </label>
                                    </div>
                                    <small class="text-muted" v-if="isEditMode && originalIsMandatory">
                                        Komponen wajib tidak dapat diubah statusnya.
                                    </small>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mt-4">
                                <router-link to="/payroll/payroll-komponen" class="btn btn-secondary me-2">Batal</router-link>
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

const formData = ref<{
    id: number | undefined,
    nama: string,
    tipe: string,
    isMandatory: boolean
}>({
    id: undefined,
    nama: '',
    tipe: '',
    isMandatory: false
})

const originalIsMandatory = ref(false)

const isEditMode = computed(() => {
    return route.params.id !== undefined
})

onMounted(() => {
    if (isEditMode.value) {
        const komponenId = parseInt(route.params.id as string)
        const komponen = pegawaiStore.payrollKomponen.find(k => k.id === komponenId)
        
        if (komponen) {
            formData.value = { ...komponen }
            originalIsMandatory.value = komponen.isMandatory
        } else {
            // Handle case when component is not found
            router.push('/payroll/payroll-komponen')
        }
    }
})

function saveKomponen() {
    if (isEditMode.value) {
        pegawaiStore.updatePayrollKomponen({ ...formData.value, id: formData.value.id! })
    } else {
        pegawaiStore.addPayrollKomponen(formData.value)
    }
    
    router.push('/payroll/payroll-komponen')
}
</script>