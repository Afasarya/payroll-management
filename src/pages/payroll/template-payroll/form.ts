import { ref } from "vue";

interface TemplatePayrollForm {
  id?: number;
  nama: string;
  deskripsi: string;
  komponenGaji: string[];
}

export let forms = ref<TemplatePayrollForm>({
  nama: "",
  deskripsi: "",
  komponenGaji: []
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.nama !== "" &&
    values.deskripsi !== "" &&
    values.komponenGaji.length > 0
  );
}