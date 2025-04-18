import { createStore } from 'vuex';
import { pegawaiModule } from './pegawai';
import { authModule } from './auth';

export default createStore({
  modules: {
    pegawai: pegawaiModule,
    auth: authModule
  }
});