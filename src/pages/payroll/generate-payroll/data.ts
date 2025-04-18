import { ref } from "vue";

export interface Month {
  name: string;
  value: number;
}

export const months: Month[] = [
  { name: 'Januari', value: 0 },
  { name: 'Februari', value: 1 },
  { name: 'Maret', value: 2 },
  { name: 'April', value: 3 },
  { name: 'Mei', value: 4 },
  { name: 'Juni', value: 5 },
  { name: 'Juli', value: 6 },
  { name: 'Agustus', value: 7 },
  { name: 'September', value: 8 },
  { name: 'Oktober', value: 9 },
  { name: 'November', value: 10 },
  { name: 'Desember', value: 11 }
];

export interface FormData {
  periode: string;
  templateId: string;
}

export const formData = ref<FormData>({
  periode: '',
  templateId: ''
});