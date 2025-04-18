import { ref } from "vue";

interface PegawaiPayrollForm {
  id?: number;
  pegawaiId: string | number;
  gajiPokok: number;
  tunjangan: number;
  potongan: number;
  totalGaji: number;
}

export let forms = ref<PegawaiPayrollForm>({
  pegawaiId: "",
  gajiPokok: 0,
  tunjangan: 0,
  potongan: 0,
  totalGaji: 0
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.pegawaiId !== "" &&
    values.gajiPokok !== 0 &&
    values.totalGaji !== 0
  );
}

export function calculateTotal(formValues: PegawaiPayrollForm): number {
  const gajiPokok = formValues.gajiPokok || 0;
  const tunjangan = formValues.tunjangan || 0;
  const potongan = formValues.potongan || 0;
  
  return gajiPokok + tunjangan - potongan;
}