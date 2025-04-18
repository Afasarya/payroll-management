<template>
    <div class="container-fluid">
        <div v-if="isLoading" class="text-center p-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Memuat detail pegawai...</p>
        </div>
        <div v-else-if="error" class="alert alert-danger m-3">
            {{ error }}
        </div>
        <div v-else-if="pegawai" class="row">
            <div class="col-xl-12">
                <Card3 colClass="col-sm-12" headerTitle="true" title="Detail Pegawai" cardhaderClass="card-no-border">
                    <div class="card-header-right">
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1">
                                <router-link :to="`/payroll/data-pegawai/edit/${pegawai.id}`" class="btn btn-warning">
                                    <i class="fa fa-edit me-2"></i>Edit
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <table class="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th style="width: 40%">Nama Pegawai</th>
                                            <td>{{ pegawai.nama }}</td>
                                        </tr>
                                        <tr>
                                            <th>Jabatan</th>
                                            <td>{{ pegawai.jabatan }}</td>
                                        </tr>
                                        <tr>
                                            <th>Departemen</th>
                                            <td>{{ pegawai.departemen }}</td>
                                        </tr>
                                        <tr>
                                            <th>Tanggal Bergabung</th>
                                            <td>{{ formatDate(pegawai.tanggalBergabung) }}</td>
                                        </tr>
                                        <tr>
                                            <th>Status</th>
                                            <td>
                                                <span class="badge" :class="pegawai.status === 'Aktif' ? 'badge-success' : 'badge-danger'">
                                                    {{ pegawai.status }}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!-- Payroll Info if exists -->
                            <div class="col-md-6" v-if="pegawaiPayroll">
                                <div class="card border">
                                    <div class="card-header bg-light">
                                        <h5 class="mb-0">Informasi Payroll</h5>
                                    </div>
                                    <div class="card-body">
                                        <table class="table table-borderless">
                                            <tbody>
                                                <tr>
                                                    <th style="width: 40%">Gaji Pokok</th>
                                                    <td>Rp {{ formatCurrency(pegawaiPayroll.gajiPokok) }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Tunjangan</th>
                                                    <td>Rp {{ formatCurrency(pegawaiPayroll.tunjangan) }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Potongan</th>
                                                    <td>Rp {{ formatCurrency(pegawaiPayroll.potongan) }}</td>
                                                </tr>
                                                <tr>
                                                    <th>Total Gaji</th>
                                                    <td class="fw-bold">Rp {{ formatCurrency(pegawaiPayroll.totalGaji) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-end mt-4">
                            <router-link to="/payroll/data-pegawai" class="btn btn-secondary">Kembali</router-link>
                        </div>
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

// Define interfaces for type safety
interface Pegawai {
  id: number;
  nama: string;
  jabatan: string;
  departemen: string;
  tanggalBergabung: string;
  status: string;
}

interface PegawaiPayroll {
  id: number;
  pegawaiId: number;
  gajiPokok: number;
  tunjangan: number;
  potongan: number;
  totalGaji: number;
}

const Card3 = defineAsyncComponent(() => import("@/components/common/card/CardData3.vue"))

const route = useRoute()
const router = useRouter()
const pegawaiStore = usePegawaiStore()

const pegawai = ref<Pegawai | null>(null)
const pegawaiPayroll = ref<PegawaiPayroll | null>(null)

// Access loading and error states from the store
const isLoading = computed(() => pegawaiStore.isLoading.value)
const error = computed(() => pegawaiStore.error.value)

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID').format(value)
}

onMounted(async () => {
    try {
        const id = Number(route.params.id)
        
        // Check if employee data is already loaded in the store
        let result = pegawaiStore.getPegawaiById(id)
        
        // If not found in store, fetch employee data
        if (!result) {
            await pegawaiStore.fetchPegawaiList()
            result = pegawaiStore.getPegawaiById(id)
        }
        
        if (result) {
            pegawai.value = result as Pegawai
            
            // Check if employee payroll data is already loaded in the store
            let payroll = pegawaiStore.getPegawaiPayrollByPegawaiId(id)
            
            // If not found in store, fetch employee payroll data
            if (!payroll) {
                await pegawaiStore.fetchPegawaiPayrollList()
                payroll = pegawaiStore.getPegawaiPayrollByPegawaiId(id)
            }
            
            if (payroll) {
                pegawaiPayroll.value = payroll as PegawaiPayroll
            }
        } else {
            // If employee not found, redirect to the employee list
            router.push('/payroll/data-pegawai')
        }
    } catch (err) {
        console.error('Failed to load employee details:', err)
    }
})
</script>