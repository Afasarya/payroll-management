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
                    <input type="text" class="form-control" id="nama" v-model="forms.nama" :disabled="disabledInput" required>
                    <div class="invalid-feedback" v-if="formSubmitted && !forms.nama">
                      Silahkan isi nama komponen
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="tipe" class="form-label">Tipe Komponen <span class="text-danger">*</span></label>
                    <select class="form-select" id="tipe" v-model="forms.tipe" :disabled="disabledInput" required>
                      <option value="" disabled>Pilih Tipe</option>
                      <option value="Pendapatan">Pendapatan</option>
                      <option value="Potongan">Potongan</option>
                    </select>
                    <div class="invalid-feedback" v-if="formSubmitted && !forms.tipe">
                      Silahkan pilih tipe komponen
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="form-check mt-4">
                      <input class="form-check-input" type="checkbox" id="isMandatory" v-model="forms.isMandatory" 
                          :disabled="disabledInput || (isEditMode && originalIsMandatory)">
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
  import { ref, defineAsyncComponent, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { usePegawaiStore } from "@/store/pegawai"
  import { forms, formSubmitted, validate, originalIsMandatory } from './form'
  
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
  
  async function saveKomponen() {
    loading.value = true;
    const isValid = validate();
    
    if (isValid) {
      if (isEditMode.value) {
        pegawaiStore.updatePayrollKomponen({ 
          ...forms.value, 
          id: Number(route.params.id) 
        });
      } else {
        pegawaiStore.addPayrollKomponen(forms.value);
      }
      
      setTimeout(() => {
        loading.value = false;
        router.push('/payroll/payroll-komponen');
      }, 500);
    } else {
      loading.value = false;
    }
  }
  
  onMounted(() => {
    if (isEditMode.value) {
      const komponenId = parseInt(route.params.id as string);
      const komponen = pegawaiStore.payrollKomponen.find(k => k.id === komponenId);
      
      if (komponen) {
        forms.value = { ...komponen };
        originalIsMandatory.value = komponen.isMandatory;
      } else {
        // Handle case when component is not found
        router.push('/payroll/payroll-komponen');
      }
    }
  });
  </script>