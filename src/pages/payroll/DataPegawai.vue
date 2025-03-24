<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <Card3 colClass="col-sm-12" table="true" headerTitle="true" title="Data Pegawai" cardhaderClass="card-no-border">
                    <div class="card-header-right">
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1">
                                <router-link to="/payroll/data-pegawai/tambah" class="btn btn-primary">
                                    <i class="fa fa-plus me-2"></i>Tambah Pegawai
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="table-responsive theme-scrollbar">
                        <form>
                            <div class="m-3 row justify-content-end">
                                <label for="table-search" class="col-xs-3 col-sm-auto col-form-label">Search:</label>
                                <div class="col-xs-3 col-sm-auto">
                                    <input id="table-search" type="text" class="form-control" v-model="filterQuery">
                                </div>
                            </div>
                            <table class="display table dataTable no-footer table-bordered">
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Nama Pegawai</th>
                                        <th>Jabatan</th>
                                        <th>Departemen</th>
                                        <th>Tanggal Bergabung</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody v-if="!get_rows().length">
                                    <tr>
                                        <td valign="top" colspan="7" class="dataTables_empty">
                                            No matching records found</td>
                                    </tr>
                                </tbody>
                                <tbody v-if="get_rows().length">
                                    <tr v-for="(row, index) in get_rows()" :key="index">
                                        <td>{{ (currentPage - 1) * elementsPerPage + index + 1 }}</td>
                                        <td>{{ row.nama }}</td>
                                        <td>{{ row.jabatan }}</td>
                                        <td>{{ row.departemen }}</td>
                                        <td>{{ formatDate(row.tanggalBergabung) }}</td>
                                        <td>
                                            <span class="badge" :class="row.status === 'Aktif' ? 'badge-success' : 'badge-danger'">
                                                {{ row.status }}
                                            </span>
                                        </td>
                                        <td class="text-center">
                                            <div class="d-flex justify-content-center">
                                                <router-link :to="`/payroll/data-pegawai/detail/${row.id}`" class="btn btn-sm btn-info me-2">
                                                    <i class="fa fa-eye"></i>
                                                </router-link>
                                                <router-link :to="`/payroll/data-pegawai/edit/${row.id}`" class="btn btn-sm btn-warning me-2">
                                                    <i class="fa fa-edit"></i>
                                                </router-link>
                                                <button class="btn btn-sm btn-danger" @click="confirmDelete(row.id)">
                                                    <i class="fa fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <ul class="pagination m-3 justify-content-end pagination-primary">
                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                    <a class="page-link" @click="prev()" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                                <li class="page-item" v-for="i in num_pages()" :key="i" :class="{ active: i === currentPage }" 
                                    @click="change_page(i)">
                                    <a class="page-link">{{ i }}</a>
                                </li>
                                <li class="page-item" :class="{ disabled: currentPage === num_pages() }">
                                    <a class="page-link" @click="next()" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </form>
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
                        Apakah Anda yakin ingin menghapus data pegawai ini?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="button" class="btn btn-danger" @click="deletePegawai" data-bs-dismiss="modal">Hapus</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent, onMounted, watch } from 'vue'
import { usePegawaiStore } from "@/store/pegawai"
import { Modal } from 'bootstrap'

const Card3 = defineAsyncComponent(() => import("@/components/common/card/CardData3.vue"))

const pegawaiStore = usePegawaiStore()
const elementsPerPage = ref<number>(10)
const currentPage = ref<number>(1)
const filterQuery = ref<string>("")
const allData = ref<any>([])
const deleteId = ref<number | null>(null)
let deleteModal: any = null

onMounted(() => {
    allData.value = pegawaiStore.pegawaiList
    // Initialize the delete modal
    deleteModal = new Modal(document.getElementById('deleteModal'))
})

watch(filterQuery, (search: string) => {
    var filteredData = pegawaiStore.pegawaiList.filter((row) => {
        return (
            row.nama.toLowerCase().includes(search.toLowerCase()) ||
            row.jabatan.toLowerCase().includes(search.toLowerCase()) ||
            row.departemen.toLowerCase().includes(search.toLowerCase()) ||
            row.status.toLowerCase().includes(search.toLowerCase())
        );
    });
    search === "" ? allData.value = pegawaiStore.pegawaiList : allData.value = filteredData
})

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

function get_rows() {
    var start = (currentPage.value - 1) * elementsPerPage.value;
    var end = start + elementsPerPage.value;
    return allData.value.slice(start, end);
}

function num_pages() {
    return Math.ceil(allData.value.length / elementsPerPage.value);
}

function change_page(page: number) {
    currentPage.value = page;
}

function next() {
    if (currentPage.value < num_pages()) {
        currentPage.value++;
    }
}

function prev() {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
}

function confirmDelete(id: number) {
    deleteId.value = id
    deleteModal.show()
}

function deletePegawai() {
    if (deleteId.value !== null) {
        pegawaiStore.deletePegawai(deleteId.value)
        allData.value = pegawaiStore.pegawaiList
        // Reset pagination if needed
        if (currentPage.value > num_pages() && currentPage.value > 1) {
            currentPage.value = num_pages()
        }
    }
}
</script>