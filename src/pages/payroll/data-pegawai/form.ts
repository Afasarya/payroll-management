import { ref } from "vue";

interface PegawaiForm {
  id?: number;
  nama: string;
  jabatan: string;
  departemen: string;
  tanggalBergabung: string;
  status: string;
}

export let forms = ref<PegawaiForm>({
  nama: "",
  jabatan: "",
  departemen: "",
  tanggalBergabung: "",
  status: "Aktif"
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.nama !== "" &&
    values.jabatan !== "" &&
    values.departemen !== "" &&
    values.tanggalBergabung !== "" &&
    values.status !== ""
  );
}