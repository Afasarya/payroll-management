import { ref } from "vue";

interface SlipGajiForm {
  periode: string | number;
  pegawaiId: string | number;
}

export let formData = ref<SlipGajiForm>({
  periode: "",
  pegawaiId: ""
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = formData.value;
  
  return values.periode !== "" && values.pegawaiId !== "";
}