<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" headerTitle="true" :title="isEditMode ? 'Edit Data Pegawai' : 'Tambah Data Pegawai'" cardhaderClass="card-no-border">
                    <div class="card-body">
                        <form @submit.prevent="savePegawai">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="nama" class="form-label">Nama Pegawai <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="nama" v-model="formData.nama" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="jabatan" class="form-label">Jabatan <span class="text-danger">*</span></label>
                                    <select class="form-select" id="jabatan" v-model="formData.jabatan" required>
                                        <option value="" disabled>Pilih Jabatan</option>
                                        <option v-for="jabatan in pegawaiStore.jabatanList" :key="jabatan" :value="jabatan">
                                            {{ jabatan }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="departemen" class="form-label">Departemen <span class="text-danger">*</span></label>
                                    <select class="form-select" id="departemen" v-model="formData.departemen" required>
                                        <option value="" disabled>Pilih Departemen</option>
                                        <option v-for="departemen in pegawaiStore.departemenList" :key="departemen" :value="departemen">
                                            {{ departemen }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="tanggalBergabung" class="form-label">Tanggal Bergabung <span class="text-danger">*</span></label>
                                    <input type="date" class="form-control" id="tanggalBergabung" v-model="formData.tanggalBergabung" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="status" class="form-label">Status <span class="text-danger">*</span></label>
                                    <select class="form-select" id="status" v-model="formData.status" required>
                                        <option value="" disabled>Pilih Status</option>
                                        <option value="Aktif">Aktif</option>
                                        <option value="Tidak Aktif">Tidak Aktif</option>
                                    </select>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mt-4">
                                <router-link to="/payroll/data-pegawai" class="btn btn-secondary me-2">Batal</router-link>
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
    id: number | null,
    nama: string,
    jabatan: string,
    departemen: string,
    tanggalBergabung: string,
    status: string
}>({
    id: null,
    nama: '',
    jabatan: '',
    departemen: '',
    tanggalBergabung: '',
    status: 'Aktif'
})

const isEditMode = computed(() => {
    return route.params.id !== undefined
})

onMounted(() => {
    if (isEditMode.value) {
        const pegawaiId = parseInt(route.params.id as string)
        const pegawai = pegawaiStore.getPegawaiById(pegawaiId)
        
        if (pegawai) {
            formData.value = { ...pegawai }
        } else {
            // Handle case when employee is not found
            router.push('/payroll/data-pegawai')
        }
    }
})

function savePegawai() {
    if (isEditMode.value) {
        pegawaiStore.updatePegawai({ ...formData.value, id: formData.value.id ?? 0 })
    } else {
        const newPegawai = { ...formData.value, id: 0 }
        pegawaiStore.addPegawai(newPegawai)
    }
    
    router.push('/payroll/data-pegawai')
}
</script>