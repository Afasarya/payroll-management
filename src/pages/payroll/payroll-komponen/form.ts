import { ref } from "vue";

interface PayrollKomponenForm {
  id?: number;
  nama: string;
  tipe: string;
  isMandatory: boolean;
}

export let forms = ref<PayrollKomponenForm>({
  nama: "",
  tipe: "",
  isMandatory: false
});

export let formSubmitted = ref<boolean>(false);
export let originalIsMandatory = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return values.nama !== "" && values.tipe !== "";
}