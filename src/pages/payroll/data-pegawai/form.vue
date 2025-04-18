<template>
    <div class="card container-fluid p-4">
      <form
        class="row g-3 needs-validation custom-input"
        novalidate
        @submit.prevent="onSubmit()"
      >
        <div class="col-md-6 mb-3">
          <label for="nama" class="form-label">Nama Pegawai <span class="text-danger">*</span></label>
          <input type="text" class="form-control" id="nama" v-model="forms.nama" :disabled="disabledInput" required>
          <div class="invalid-feedback" v-if="formSubmitted && !forms.nama">
            Silahkan isi nama pegawai
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <label for="jabatan" class="form-label">Jabatan <span class="text-danger">*</span></label>
          <select class="form-select" id="jabatan" v-model="forms.jabatan" :disabled="disabledInput" required>
            <option value="" disabled>Pilih Jabatan</option>
            <option v-for="jabatan in pegawaiStore.jabatanList" :key="jabatan" :value="jabatan">
              {{ jabatan }}
            </option>
          </select>
          <div class="invalid-feedback" v-if="formSubmitted && !forms.jabatan">
            Silahkan pilih jabatan
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <label for="departemen" class="form-label">Departemen <span class="text-danger">*</span></label>
          <select class="form-select" id="departemen" v-model="forms.departemen" :disabled="disabledInput" required>
            <option value="" disabled>Pilih Departemen</option>
            <option v-for="departemen in pegawaiStore.departemenList" :key="departemen" :value="departemen">
              {{ departemen }}
            </option>
          </select>
          <div class="invalid-feedback" v-if="formSubmitted && !forms.departemen">
            Silahkan pilih departemen
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <label for="tanggalBergabung" class="form-label">Tanggal Bergabung <span class="text-danger">*</span></label>
          <input type="date" class="form-control" id="tanggalBergabung" v-model="forms.tanggalBergabung" :disabled="disabledInput" required>
          <div class="invalid-feedback" v-if="formSubmitted && !forms.tanggalBergabung">
            Silahkan pilih tanggal bergabung
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <label for="status" class="form-label">Status <span class="text-danger">*</span></label>
          <select class="form-select" id="status" v-model="forms.status" :disabled="disabledInput" required>
            <option value="" disabled>Pilih Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
          <div class="invalid-feedback" v-if="formSubmitted && !forms.status">
            Silahkan pilih status
          </div>
        </div>
        
        <div class="d-flex justify-content-end mt-4">
          <router-link to="/payroll/data-pegawai" class="btn btn-secondary me-2">Batal</router-link>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ isEditMode ? 'Update' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { computed, onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { usePegawaiStore } from "@/store/pegawai";
  import { validate, forms, formSubmitted } from "./form";
  
  const router = useRouter();
  const route = useRoute();
  const pegawaiStore = usePegawaiStore();
  const loading = ref(false);
  
  const isEditMode = computed(() => {
    return route.params.id !== undefined;
  });
  
  const disabledInput = computed(() => {
    return route.path.includes('detail');
  });
  
  onMounted(() => {
    if (isEditMode.value) {
      const pegawaiId = parseInt(route.params.id as string);
      const pegawai = pegawaiStore.getPegawaiById(pegawaiId);
      
      if (pegawai) {
        forms.value = { ...pegawai };
      } else {
        // Handle case when employee is not found
        router.push('/payroll/data-pegawai');
      }
    }
  });
  
  function onSubmit() {
    loading.value = true;
    const isValid = validate();
    
    if (isValid) {
      if (isEditMode.value) {
        pegawaiStore.updatePegawai({ ...forms.value, id: parseInt(route.params.id as string) });
      } else {
        pegawaiStore.addPegawai({ ...forms.value });
      }
      
      setTimeout(() => {
        loading.value = false;
        router.push('/payroll/data-pegawai');
      }, 500);
    } else {
      loading.value = false;
    }
  }
  </script>