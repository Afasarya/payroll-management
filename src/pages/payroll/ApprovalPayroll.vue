<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" table="true" headerTitle="true" title="Approval Payroll" cardhaderClass="card-no-border">
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
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody v-if="!pendingPayrolls.length">
                                <tr>
                                    <td valign="top" colspan="7" class="dataTables_empty">
                                        Tidak ada data yang menunggu approval</td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr v-for="(payroll, index) in pendingPayrolls" :key="payroll.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ payroll.periode }}</td>
                                    <td>{{ formatDate(payroll.tanggalGenerate) }}</td>
                                    <td>{{ payroll.jumlahPegawai }}</td>
                                    <td>Rp {{ formatCurrency(payroll.totalGaji) }}</td>
                                    <td>
                                        <span class="badge bg-warning">
                                            {{ payroll.status }}
                                        </span>
                                    </td>
                                    <td class="text-center">
                                        <button class="btn btn-sm btn-success me-2" @click="showPayrollDetails(payroll.id)">
                                            <i class="fa fa-eye me-1"></i> Lihat
                                        </button>
                                        <button class="btn btn-sm btn-primary" @click="approvePayroll(payroll.id)">
                                            <i class="fa fa-check me-1"></i> Approve
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card3>
            </div>
        </div>

        <!-- Approved Payrolls Section -->
        <div class="row mt-4">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" table="true" headerTitle="true" title="Payroll yang Disetujui" cardhaderClass="card-no-border">
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
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody v-if="!approvedPayrolls.length">
                                <tr>
                                    <td valign="top" colspan="7" class="dataTables_empty">
                                        Tidak ada data payroll yang telah disetujui</td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr v-for="(payroll, index) in approvedPayrolls" :key="payroll.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ payroll.periode }}</td>
                                    <td>{{ formatDate(payroll.tanggalGenerate) }}</td>
                                    <td>{{ payroll.jumlahPegawai }}</td>
                                    <td>Rp {{ formatCurrency(payroll.totalGaji) }}</td>
                                    <td>
                                        <span class="badge bg-success">
                                            {{ payroll.status }}
                                        </span>
                                    </td>
                                    <td class="text-center">
                                        <button class="btn btn-sm btn-primary" @click="showPayrollDetails(payroll.id)">
                                            <i class="fa fa-eye me-1"></i> Lihat
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card3>
            </div>
        </div>

        <!-- Payroll Details Modal -->
        <div class="modal fade" id="payrollDetailModal" tabindex="-1" aria-labelledby="payrollDetailModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="payrollDetailModalLabel">Detail Payroll</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-4" v-if="selectedPayroll">
                            <div class="col-md-6">
                                <h6>Periode: {{ selectedPayroll.periode }}</h6>
                                <h6>Tanggal Generate: {{ formatDate(selectedPayroll.tanggalGenerate) }}</h6>
                            </div>
                            <div class="col-md-6 text-end">
                                <h6>Total Pegawai: {{ selectedPayroll.jumlahPegawai }}</h6>
                                <h6>Total Gaji: Rp {{ formatCurrency(selectedPayroll.totalGaji) }}</h6>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="display table table-bordered">
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
                                <tbody>
                                    <tr v-for="(item, index) in payrollDetails" :key="index">
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
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                        <button 
                            v-if="selectedPayroll && selectedPayroll.status === 'Pending Approval'" 
                            type="button" 
                            class="btn btn-primary" 
                            @click="approveSelectedPayroll"
                            data-bs-dismiss="modal">
                            Approve Payroll
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Confirmation Modal -->
        <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmationModalLabel">Konfirmasi Approval</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Apakah Anda yakin akan menyetujui payroll ini?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="button" class="btn btn-primary" @click="confirmApproval" data-bs-dismiss="modal">Ya, Setujui</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent, computed, onMounted } from 'vue'
import { usePegawaiStore } from "@/store/pegawai"
import { Modal } from 'bootstrap'

const Card3 = defineAsyncComponent(() => import("@/components/common/card/CardData3.vue"))

const pegawaiStore = usePegawaiStore()
const payrollToApprove = ref<number | null>(null)
const selectedPayroll = ref<any>(null)
const payrollDetails = ref<{ pegawai: any, payroll: any }[]>([])
let detailModal: any = null
let confirmModal: any = null

const pendingPayrolls = computed(() => {
    return pegawaiStore.generatedPayrolls
        .filter(p => p.status === 'Pending Approval')
        .sort((a, b) => new Date(b.tanggalGenerate).getTime() - new Date(a.tanggalGenerate).getTime())
})

const approvedPayrolls = computed(() => {
    return pegawaiStore.generatedPayrolls
        .filter(p => p.status === 'Approved')
        .sort((a, b) => new Date(b.tanggalGenerate).getTime() - new Date(a.tanggalGenerate).getTime())
})

onMounted(() => {
    // Initialize modals
    detailModal = new Modal(document.getElementById('payrollDetailModal'))
    confirmModal = new Modal(document.getElementById('confirmationModal'))
})

function formatDate(dateString: string) {
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

function showPayrollDetails(id: number) {
    const payroll = pegawaiStore.generatedPayrolls.find(p => p.id === id)
    if (payroll) {
        selectedPayroll.value = payroll
        
        // Generate mock payroll details (in a real app, this would come from the backend)
        const pegawaiWithPayroll = pegawaiStore.pegawaiPayrollList.map(payrollItem => {
            const pegawai = pegawaiStore.getPegawaiById(payrollItem.pegawaiId)
            return {
                pegawai,
                payroll: payrollItem
            }
        }).filter(item => item.pegawai && item.pegawai.status === 'Aktif')
        
        payrollDetails.value = pegawaiWithPayroll
        
        // Show modal
        detailModal.show()
    }
}

function approvePayroll(id: number) {
    payrollToApprove.value = id
    confirmModal.show()
}

function approveSelectedPayroll() {
    if (selectedPayroll.value) {
        pegawaiStore.updateGeneratedPayrollStatus(selectedPayroll.value.id, 'Approved')
        selectedPayroll.value = null
    }
}

function confirmApproval() {
    if (payrollToApprove.value !== null) {
        pegawaiStore.updateGeneratedPayrollStatus(payrollToApprove.value, 'Approved')
        payrollToApprove.value = null
    }
}
</script>