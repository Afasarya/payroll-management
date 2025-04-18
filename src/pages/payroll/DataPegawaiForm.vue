<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" headerTitle="true" :title="isEditMode ? 'Edit Data Pegawai' : 'Tambah Data Pegawai'" cardhaderClass="card-no-border">
                    <div v-if="isLoading" class="text-center p-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">{{ isEditMode ? 'Memuat data pegawai...' : 'Mempersiapkan formulir...' }}</p>
                    </div>
                    <div v-else-if="error" class="alert alert-danger m-3">
                        {{ error }}
                    </div>
                    <div v-else class="card-body">
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
                                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    {{ isEditMode ? 'Update' : 'Simpan' }}
                                </button>
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

const isSubmitting = ref(false)

// Access loading and error states from the store
const isLoading = computed(() => pegawaiStore.isLoading.value)
const error = computed(() => pegawaiStore.error.value)

const isEditMode = computed(() => {
    return route.params.id !== undefined
})

onMounted(async () => {
    try {
        // Load departments and positions if not already loaded
        if (!pegawaiStore.departemenList.value.length || !pegawaiStore.jabatanList.value.length) {
            await pegawaiStore.fetchPegawaiList()
        }
        
        // If in edit mode, fetch employee data
        if (isEditMode.value) {
            const pegawaiId = parseInt(route.params.id as string)
            
            // Check if the data is already loaded in the store
            let pegawai = pegawaiStore.getPegawaiById(pegawaiId)
            
            // If not found in store, fetch it
            if (!pegawai) {
                await pegawaiStore.fetchPegawaiList()
                pegawai = pegawaiStore.getPegawaiById(pegawaiId)
            }
            
            if (pegawai) {
                formData.value = { ...pegawai }
            } else {
                // Handle case when employee is not found
                router.push('/payroll/data-pegawai')
            }
        }
    } catch (err) {
        console.error('Failed to load employee data:', err)
    }
})

async function savePegawai() {
    try {
        isSubmitting.value = true
        
        if (isEditMode.value) {
            await pegawaiStore.updatePegawai({ ...formData.value, id: formData.value.id ?? 0 })
        } else {
            const newPegawai = { ...formData.value, id: 0 }
            await pegawaiStore.addPegawai(newPegawai)
        }
        
        router.push('/payroll/data-pegawai')
    } catch (err) {
        console.error('Failed to save employee:', err)
    } finally {
        isSubmitting.value = false
    }
}
</script>