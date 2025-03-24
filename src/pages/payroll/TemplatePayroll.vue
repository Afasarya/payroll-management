<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" table="true" headerTitle="true" title="Template Payroll" cardhaderClass="card-no-border">
                    <div class="card-header-right">
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1">
                                <router-link to="/payroll/template-payroll/tambah" class="btn btn-primary">
                                    <i class="fa fa-plus me-2"></i>Tambah Template
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="table-responsive theme-scrollbar">
                        <table class="display table dataTable no-footer table-bordered">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Nama Template</th>
                                    <th>Deskripsi</th>
                                    <th>Komponen</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody v-if="!pegawaiStore.templatePayroll.length">
                                <tr>
                                    <td valign="top" colspan="5" class="dataTables_empty">
                                        No records found</td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr v-for="(template, index) in pegawaiStore.templatePayroll" :key="template.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ template.nama }}</td>
                                    <td>{{ template.deskripsi }}</td>
                                    <td>
                                        <div class="d-flex flex-wrap gap-1">
                                            <span v-for="komponen in template.komponenGaji" :key="komponen" 
                                                class="badge rounded-pill bg-primary me-1 mb-1">
                                                {{ komponen }}
                                            </span>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <div class="d-flex justify-content-center">
                                            <router-link :to="`/payroll/template-payroll/edit/${template.id}`" class="btn btn-sm btn-warning me-2">
                                                <i class="fa fa-edit"></i>
                                            </router-link>
                                            <button class="btn btn-sm btn-danger" @click="confirmDelete(template.id)">
                                                <i class="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card3>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalLabel">Konfirmasi Hapus</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Apakah Anda yakin ingin menghapus template payroll ini?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="button" class="btn btn-danger" @click="deleteTemplate" data-bs-dismiss="modal">Hapus</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent, onMounted } from 'vue'
import { usePegawaiStore } from "@/store/pegawai"
import { Modal } from 'bootstrap'

const Card3 = defineAsyncComponent(() => import("@/components/common/card/CardData3.vue"))

const pegawaiStore = usePegawaiStore()
const deleteId = ref<number | null>(null)
let deleteModal: any = null

onMounted(() => {
    // Initialize the delete modal
    deleteModal = new Modal(document.getElementById('deleteModal'))
})

function confirmDelete(id: number) {
    deleteId.value = id
    deleteModal.show()
}

function deleteTemplate() {
    if (deleteId.value !== null) {
        pegawaiStore.deleteTemplatePayroll(deleteId.value)
    }
}
</script>