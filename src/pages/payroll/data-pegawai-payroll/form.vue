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
                    <select class="form-select" id="pegawaiId" v-model="forms.pegawaiId" required :disabled="isEditMode || disabledInput">
                      <option value="" disabled>Pilih Pegawai</option>
                      <option v-for="pegawai in availablePegawai" :key="pegawai.id" :value="pegawai.id">
                        {{ pegawai.nama }} - {{ pegawai.departemen }} ({{ pegawai.jabatan }})
                      </option>
                    </select>
                    <div class="invalid-feedback" v-if="formSubmitted && !forms.pegawaiId">
                      Silahkan pilih pegawai
                    </div>
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
                      <input type="number" class="form-control" id="gajiPokok" v-model="forms.gajiPokok" 
                        required :disabled="disabledInput" @input="calculateTotalHandler">
                      <div class="invalid-feedback" v-if="formSubmitted && !forms.gajiPokok">
                        Silahkan isi gaji pokok
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="tunjangan" class="form-label">Tunjangan <span class="text-danger">*</span></label>
                    <div class="input-group">
                      <span class="input-group-text">Rp</span>
                      <input type="number" class="form-control" id="tunjangan" v-model="forms.tunjangan" 
                        required :disabled="disabledInput" @input="calculateTotalHandler">
                      <div class="invalid-feedback" v-if="formSubmitted && !forms.tunjangan">
                        Silahkan isi tunjangan
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="potongan" class="form-label">Potongan <span class="text-danger">*</span></label>
                    <div class="input-group">
                      <span class="input-group-text">Rp</span>
                      <input type="number" class="form-control" id="potongan" v-model="forms.potongan" 
                        required :disabled="disabledInput" @input="calculateTotalHandler">
                      <div class="invalid-feedback" v-if="formSubmitted && !forms.potongan">
                        Silahkan isi potongan
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="totalGaji" class="form-label">Total Gaji</label>
                    <div class="input-group">
                      <span class="input-group-text">Rp</span>
                      <input type="number" class="form-control bg-light" id="totalGaji" v-model="forms.totalGaji" readonly>
                    </div>
                  </div>
                </div>
                <div class="d-flex justify-content-end mt-4">
                  <router-link to="/payroll/data-pegawai-payroll" class="btn btn-secondary me-2">Batal</router-link>
                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
  import { ref, defineAsyncComponent, onMounted, computed, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { usePegawaiStore } from "@/store/pegawai"
  import { forms, formSubmitted, validate, calculateTotal } from './form'
  
  const Card3 = defineAsyncComponent(() => import("@/components/common/card/CardData3.vue"))
  
  const route = useRoute();
  const router = useRouter();
  const pegawaiStore = usePegawaiStore();
  const loading = ref(false);
  
  const isEditMode = computed(() => {
    return route.params.id !== undefined;
  });
  
  const disabledInput = computed(() => {
    return route.path.includes('detail');
  });
  
  // Get only employees that don't have payroll data already (for Add mode)
  const availablePegawai = computed(() => {
    if (isEditMode.value) {
      // For edit mode, just return all employees
      return pegawaiStore.pegawaiList;
    } else {
      // For add mode, filter out employees that already have payroll data
      return pegawaiStore.pegawaiList.filter(pegawai => {
        return !pegawaiStore.pegawaiPayrollList.some(payroll => payroll.pegawaiId === pegawai.id);
      });
    }
  });
  
  const selectedPegawai = computed(() => {
    if (!forms.value.pegawaiId) return null;
    return pegawaiStore.getPegawaiById(Number(forms.value.pegawaiId));
  });
  
  watch(() => forms.value.pegawaiId, (newVal) => {
    if (newVal && !isEditMode.value) {
      // Reset values when employee changes (in add mode)
      forms.value.gajiPokok = 0;
      forms.value.tunjangan = 0;
      forms.value.potongan = 0;
      forms.value.totalGaji = 0;
    }
  });
  
  function calculateTotalHandler() {
    forms.value.totalGaji = calculateTotal(forms.value);
  }
  
  async function savePayroll() {
    loading.value = true;
    const isValid = validate();
    
    if (isValid) {
      if (isEditMode.value) {
        pegawaiStore.updatePegawaiPayroll({
          ...forms.value,
          id: Number(route.params.id),
          pegawaiId: Number(forms.value.pegawaiId)
        });
      } else {
        pegawaiStore.addPegawaiPayroll({
          ...forms.value,
          pegawaiId: Number(forms.value.pegawaiId)
        });
      }
      
      setTimeout(() => {
        loading.value = false;
        router.push('/payroll/data-pegawai-payroll');
      }, 500);
    } else {
      loading.value = false;
    }
  }
  
  onMounted(() => {
    if (isEditMode.value) {
      const payrollId = Number(route.params.id);
      const payroll = pegawaiStore.getPegawaiPayrollById(payrollId);
      
      if (payroll) {
        forms.value = { 
          ...payroll,
          pegawaiId: payroll.pegawaiId.toString() 
        };
      } else {
        // Handle case when payroll data is not found
        router.push('/payroll/data-pegawai-payroll');
      }
    }
  });
  </script>