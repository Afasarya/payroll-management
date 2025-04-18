<template>
    <div class="container-fluid" v-if="pegawai">
        <div class="row">
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
import { ref, defineAsyncComponent, onMounted } from 'vue'
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

onMounted(() => {
    const id = Number(route.params.id)
    const result = pegawaiStore.pegawaiList.find((p: Pegawai) => p.id === id)
    
    if (result) {
        pegawai.value = result

    } else {

        router.push('/payroll/data-pegawai')
    }
})
</script>