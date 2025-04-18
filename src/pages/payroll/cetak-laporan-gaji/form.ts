import { ref } from "vue";

interface LaporanGajiForm {
  jenis: string;
  periode: string;
  departemen?: string;
  tahun?: string;
}

export let formData = ref<LaporanGajiForm>({
  jenis: "",
  periode: "",
  departemen: "",
  tahun: ""
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = formData.value;
  
  if (values.jenis === 'bulanan') {
    return values.periode !== "";
  } else if (values.jenis === 'departemen') {
    return values.periode !== "" && values.departemen !== "";
  } else if (values.jenis === 'rekap') {
    return values.tahun !== "";
  }
  
  return false;
}