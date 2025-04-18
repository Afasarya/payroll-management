<template>
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <Card3 colClass="col-sm-12" headerTitle="true" :title="isEditMode ? 'Edit Template Payroll' : 'Tambah Template Payroll'" cardhaderClass="card-no-border">
            <div class="card-body">
              <form @submit.prevent="saveTemplate">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="nama" class="form-label">Nama Template <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="nama" v-model="forms.nama" :disabled="disabledInput" required>
                    <div class="invalid-feedback" v-if="formSubmitted && !forms.nama">
                      Silahkan isi nama template
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="deskripsi" class="form-label">Deskripsi <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="deskripsi" v-model="forms.deskripsi" :disabled="disabledInput" required>
                    <div class="invalid-feedback" v-if="formSubmitted && !forms.deskripsi">
                      Silahkan isi deskripsi
                    </div>
                  </div>
                </div>
                
                <div class="row mt-3">
                  <div class="col-md-12">
                    <label class="form-label">Komponen Gaji <span class="text-danger">*</span></label>
                    
                    <div class="row">
                      <div class="col-md-6">
                        <div class="card border mb-3">
                          <div class="card-header bg-light">
                            <h6 class="mb-0">Komponen Pendapatan</h6>
                          </div>
                          <div class="card-body">
                            <div class="row">
                              <div class="col-md-12" v-for="komponen in pendapatanKomponen" :key="komponen.id">
                                <div class="form-check mb-2">
                                  <input 
                                    class="form-check-input" 
                                    type="checkbox" 
                                    :id="`komponen-${komponen.id}`"
                                    :value="komponen.nama"
                                    v-model="forms.komponenGaji"
                                    :disabled="disabledInput || komponen.isMandatory"
                                    :checked="komponen.isMandatory || forms.komponenGaji.includes(komponen.nama)"
                                  >
                                  <label class="form-check-label" :for="`komponen-${komponen.id}`">
                                    {{ komponen.nama }}
                                    <span class="badge bg-info ms-1" v-if="komponen.isMandatory">Wajib</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="col-md-6">
                        <div class="card border mb-3">
                          <div class="card-header bg-light">
                            <h6 class="mb-0">Komponen Potongan</h6>
                          </div>
                          <div class="card-body">
                            <div class="row">
                              <div class="col-md-12" v-for="komponen in potonganKomponen" :key="komponen.id">
                                <div class="form-check mb-2">
                                  <input 
                                    class="form-check-input" 
                                    type="checkbox" 
                                    :id="`komponen-${komponen.id}`"
                                    :value="komponen.nama"
                                    v-model="forms.komponenGaji"
                                    :disabled="disabledInput || komponen.isMandatory"
                                    :checked="komponen.isMandatory || forms.komponenGaji.includes(komponen.nama)"
                                  >
                                  <label class="form-check-label" :for="`komponen-${komponen.id}`">
                                    {{ komponen.nama }}
                                    <span class="badge bg-info ms-1" v-if="komponen.isMandatory">Wajib</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="invalid-feedback d-block" v-if="formSubmitted && !forms.komponenGaji.length">
                      Silahkan pilih minimal satu komponen gaji
                    </div>
                  </div>
                </div>
                
                <div class="d-flex justify-content-end mt-4">
                  <router-link to="/payroll/template-payroll" class="btn btn-secondary me-2">Batal</router-link>
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
  import { forms, formSubmitted, validate } from './form'
  
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
  
  const pendapatanKomponen = computed(() => {
    return pegawaiStore.payrollKomponen.filter(k => k.tipe === 'Pendapatan');
  });
  
  const potonganKomponen = computed(() => {
    return pegawaiStore.payrollKomponen.filter(k => k.tipe === 'Potongan');
  });
  
  async function saveTemplate() {
    loading.value = true;
    const isValid = validate();
    
    if (isValid) {
      if (isEditMode.value) {
        pegawaiStore.updateTemplatePayroll({ 
          ...forms.value, 
          id: Number(route.params.id) 
        });
      } else {
        pegawaiStore.addTemplatePayroll(forms.value);
      }
      
      setTimeout(() => {
        loading.value = false;
        router.push('/payroll/template-payroll');
      }, 500);
    } else {
      loading.value = false;
    }
  }
  
  onMounted(() => {
    // Initialize with mandatory components
    const mandatoryComponents = pegawaiStore.payrollKomponen
      .filter(k => k.isMandatory)
      .map(k => k.nama);
    
    forms.value.komponenGaji = [...mandatoryComponents];
    
    if (isEditMode.value) {
      const templateId = parseInt(route.params.id as string);
      const template = pegawaiStore.templatePayroll.find(t => t.id === templateId);
      
      if (template) {
        forms.value = { ...template };
      } else {
        // Handle case when template is not found
        router.push('/payroll/template-payroll');
      }
    }
  });
  </script>