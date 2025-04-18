import { Module } from 'vuex';
import { 
  employeeService, 
  payrollService, 
  employeePayrollService,
  departmentService, 
  positionService,
  payrollComponentService,
  workingHourService,
  workLocationService,
  templatePayrollService
} from '@/services/api';
import { computed } from 'vue';
import store from '@/store'; // Ensure the correct path to your Vuex store

// Define interfaces
export interface Pegawai {
  id: number;
  nama: string;
  jabatan: string;
  departemen: string;
  tanggalBergabung: string;
  status: string;
  [key: string]: any;
}

export interface PegawaiPayroll {
  id: number;
  pegawaiId: number;
  gajiPokok: number;
  tunjangan: number;
  potongan: number;
  totalGaji: number;
  [key: string]: any;
}

export interface GeneratedPayroll {
  id: number | string;
  periode: string;
  tanggalGenerate: string;
  jumlahPegawai: number;
  totalGaji: number;
  status: string;
  [key: string]: any;
}

export interface PayrollComponent {
  id: number;
  name: string;
  type_component: string;
  type_value: string;
  amount: number;
  is_permanent: number;
  is_pajak: number;
  status: string;
  [key: string]: any;
}

export interface TemplatePayroll {
  id: number;
  nama: string;
  deskripsi: string;
  komponenGaji: string[];
  [key: string]: any;
}

export interface Department {
  id: number;
  name: string;
  status: string;
  [key: string]: any;
}

export interface Position {
  id: number;
  name: string;
  allowance: number;
  status: string;
  [key: string]: any;
}

export interface WorkingHour {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  status: boolean;
  [key: string]: any;
}

export interface WorkLocation {
  id: number;
  name: string;
  allowance: number;
  status: string;
  [key: string]: any;
}

export interface PegawaiState {
  pegawaiList: Pegawai[];
  pegawaiPayrollList: PegawaiPayroll[];
  generatedPayrolls: GeneratedPayroll[];
  payrollKomponen: PayrollComponent[];
  templatePayroll: TemplatePayroll[];
  departemenList: string[];
  jabatanList: string[];
  departments: Department[];
  positions: Position[];
  workingHours: WorkingHour[];
  workLocations: WorkLocation[];
  loading: boolean;
  error: string | null;
}

export const pegawaiModule: Module<PegawaiState, any> = {
  namespaced: true,

  state: () => ({
    pegawaiList: [],
    pegawaiPayrollList: [],
    generatedPayrolls: [],
    payrollKomponen: [],
    templatePayroll: [],
    departemenList: [],
    jabatanList: [],
    departments: [],
    positions: [],
    workingHours: [],
    workLocations: [],
    loading: false,
    error: null
  }),

  mutations: {
    SET_PEGAWAI_LIST(state, payload) {
      state.pegawaiList = payload;
    },
    SET_PEGAWAI_PAYROLL_LIST(state, payload) {
      state.pegawaiPayrollList = payload;
    },
    SET_GENERATED_PAYROLLS(state, payload) {
      state.generatedPayrolls = payload;
    },
    SET_PAYROLL_KOMPONEN(state, payload) {
      state.payrollKomponen = payload;
    },
    SET_TEMPLATE_PAYROLL(state, payload) {
      state.templatePayroll = payload;
    },
    SET_DEPARTEMEN_LIST(state, payload) {
      state.departemenList = payload;
    },
    SET_JABATAN_LIST(state, payload) {
      state.jabatanList = payload;
    },
    SET_DEPARTMENTS(state, payload) {
      state.departments = payload;
    },
    SET_POSITIONS(state, payload) {
      state.positions = payload;
    },
    SET_WORKING_HOURS(state, payload) {
      state.workingHours = payload;
    },
    SET_WORK_LOCATIONS(state, payload) {
      state.workLocations = payload;
    },
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    },

    // Add a single pegawai
    ADD_PEGAWAI(state, payload) {
      state.pegawaiList.push(payload);
    },
    // Update a pegawai
    UPDATE_PEGAWAI(state, payload) {
      const index = state.pegawaiList.findIndex(p => p.id === payload.id);
      if (index !== -1) {
        state.pegawaiList[index] = payload;
      }
    },
    // Delete a pegawai
    DELETE_PEGAWAI(state, id) {
      state.pegawaiList = state.pegawaiList.filter(p => p.id !== id);
    },

    // Add pegawai payroll
    ADD_PEGAWAI_PAYROLL(state, payload) {
      state.pegawaiPayrollList.push(payload);
    },
    // Update pegawai payroll
    UPDATE_PEGAWAI_PAYROLL(state, payload) {
      const index = state.pegawaiPayrollList.findIndex(p => p.id === payload.id);
      if (index !== -1) {
        state.pegawaiPayrollList[index] = payload;
      }
    },
    // Delete pegawai payroll
    DELETE_PEGAWAI_PAYROLL(state, id) {
      state.pegawaiPayrollList = state.pegawaiPayrollList.filter(p => p.id !== id);
    },

    // Add generated payroll
    ADD_GENERATED_PAYROLL(state, payload) {
      state.generatedPayrolls.push(payload);
    },
    // Update generated payroll status
    UPDATE_GENERATED_PAYROLL_STATUS(state, { id, status }) {
      const index = state.generatedPayrolls.findIndex(p => p.id === id);
      if (index !== -1) {
        state.generatedPayrolls[index].status = status;
      }
    },
    // Delete generated payroll
    DELETE_GENERATED_PAYROLL(state, id) {
      state.generatedPayrolls = state.generatedPayrolls.filter(p => p.id !== id);
    },

    // Add payroll component
    ADD_PAYROLL_COMPONENT(state, payload) {
      state.payrollKomponen.push(payload);
    },
    // Update payroll component
    UPDATE_PAYROLL_COMPONENT(state, payload) {
      const index = state.payrollKomponen.findIndex(p => p.id === payload.id);
      if (index !== -1) {
        state.payrollKomponen[index] = payload;
      }
    },
    // Delete payroll component
    DELETE_PAYROLL_COMPONENT(state, id) {
      state.payrollKomponen = state.payrollKomponen.filter(p => p.id !== id);
    },

    // Add template payroll
    ADD_TEMPLATE_PAYROLL(state, payload) {
      state.templatePayroll.push(payload);
    },
    // Update template payroll
    UPDATE_TEMPLATE_PAYROLL(state, payload) {
      const index = state.templatePayroll.findIndex(p => p.id === payload.id);
      if (index !== -1) {
        state.templatePayroll[index] = payload;
      }
    },
    // Delete template payroll
    DELETE_TEMPLATE_PAYROLL(state, id) {
      state.templatePayroll = state.templatePayroll.filter(p => p.id !== id);
    }
  },

  actions: {
    // Employee actions
    async fetchPegawaiList({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await employeeService.getEmployees();
        
        commit('SET_PEGAWAI_LIST', response.data);
        
        // Extract unique departments and positions for dropdown lists
        const departements = [...new Set(response.data.map((p: Pegawai) => p.departemen))];
        const jabatan = [...new Set(response.data.map((p: Pegawai) => p.jabatan))];
        
        commit('SET_DEPARTEMEN_LIST', departements);
        commit('SET_JABATAN_LIST', jabatan);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch employee list');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addPegawai({ commit }, pegawaiData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await employeeService.createEmployee(pegawaiData);
        
        commit('ADD_PEGAWAI', response.data);
        return response.data;
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to add employee');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updatePegawai({ commit }, pegawaiData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await employeeService.updateEmployee(pegawaiData.id, pegawaiData);
        
        commit('UPDATE_PEGAWAI', response.data);
        return response.data;
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update employee');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deletePegawai({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        await employeeService.deleteEmployee(id);
        
        commit('DELETE_PEGAWAI', id);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to delete employee');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Payroll actions
    async fetchGeneratedPayrolls({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await payrollService.getGeneratedPayrolls();
        
        commit('SET_GENERATED_PAYROLLS', response.data);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch generated payrolls');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addGeneratedPayroll({ commit }, payrollData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await payrollService.createPayroll(payrollData);
        
        commit('ADD_GENERATED_PAYROLL', response.data);
        return response.data;
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to add generated payroll');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateGeneratedPayrollStatus({ commit }, { id, status }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        await payrollService.updatePayrollStatus(id, status);
        
        commit('UPDATE_GENERATED_PAYROLL_STATUS', { id, status });
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update payroll status');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteGeneratedPayroll({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        await payrollService.deletePayroll(id);
        
        commit('DELETE_GENERATED_PAYROLL', id);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to delete generated payroll');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Employee Payroll actions
    async fetchPegawaiPayrollList({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await employeePayrollService.getEmployeePayrolls();
        
        commit('SET_PEGAWAI_PAYROLL_LIST', response.data);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch employee payroll list');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addPegawaiPayroll({ commit }, payrollData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await employeePayrollService.createEmployeePayroll(payrollData);
        
        commit('ADD_PEGAWAI_PAYROLL', response.data);
        return response.data;
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to add employee payroll');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updatePegawaiPayroll({ commit }, payrollData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await employeePayrollService.updateEmployeePayroll(payrollData.id, payrollData);
        
        commit('UPDATE_PEGAWAI_PAYROLL', response.data);
        return response.data;
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update employee payroll');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deletePegawaiPayroll({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        await employeePayrollService.deleteEmployeePayroll(id);
        
        commit('DELETE_PEGAWAI_PAYROLL', id);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to delete employee payroll');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Payroll Component actions
    async fetchPayrollKomponen({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await payrollComponentService.getPayrollComponents();
        
        commit('SET_PAYROLL_KOMPONEN', response.data);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch payroll components');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addPayrollKomponen({ commit }, componentData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await payrollComponentService.createPayrollComponent(componentData);
        
        commit('ADD_PAYROLL_COMPONENT', response.data);
        return response.data;
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to add payroll component');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updatePayrollKomponen({ commit }, componentData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await payrollComponentService.updatePayrollComponent(componentData.id, componentData);
        
        commit('UPDATE_PAYROLL_COMPONENT', response.data);
        return response.data;
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update payroll component');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deletePayrollKomponen({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        await payrollComponentService.deletePayrollComponent(id);
        
        commit('DELETE_PAYROLL_COMPONENT', id);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to delete payroll component');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Template Payroll actions
    async fetchTemplatePayroll({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await templatePayrollService.getTemplatePayrolls();
        
        commit('SET_TEMPLATE_PAYROLL', response.data);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch template payrolls');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addTemplatePayroll({ commit }, templateData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await templatePayrollService.createTemplatePayroll(templateData);
        
        commit('ADD_TEMPLATE_PAYROLL', response.data);
        return response.data;
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to add template payroll');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateTemplatePayroll({ commit }, templateData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await templatePayrollService.updateTemplatePayroll(templateData.id, templateData);
        
        commit('UPDATE_TEMPLATE_PAYROLL', response.data);
        return response.data;
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update template payroll');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteTemplatePayroll({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        await templatePayrollService.deleteTemplatePayroll(id);
        
        commit('DELETE_TEMPLATE_PAYROLL', id);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to delete template payroll');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Department actions
    async fetchDepartments({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await departmentService.getDepartments();
        
        commit('SET_DEPARTMENTS', response.data);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch departments');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Position actions
    async fetchPositions({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await positionService.getPositions();
        
        commit('SET_POSITIONS', response.data);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch positions');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Working Hour actions
    async fetchWorkingHours({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await workingHourService.getWorkingHours();
        
        commit('SET_WORKING_HOURS', response.data);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch working hours');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Work Location actions
    async fetchWorkLocations({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await workLocationService.getWorkLocations();
        
        commit('SET_WORK_LOCATIONS', response.data);
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch work locations');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  getters: {
    // Pegawai getters
    getPegawaiList: (state) => state.pegawaiList,
    
    getPegawaiById: (state) => (id: number) => {
      return state.pegawaiList.find(p => p.id === id) || null;
    },
    
    // Pegawai Payroll getters
    getPegawaiPayrollList: (state) => state.pegawaiPayrollList,
    
    getPegawaiPayrollById: (state) => (id: number) => {
      return state.pegawaiPayrollList.find(p => p.id === id) || null;
    },
    
    getPegawaiPayrollByPegawaiId: (state) => (pegawaiId: number) => {
      return state.pegawaiPayrollList.find(p => p.pegawaiId === pegawaiId) || null;
    },
    
    // Generated Payroll getters
    getGeneratedPayrolls: (state) => state.generatedPayrolls,
    
    getGeneratedPayrollById: (state) => (id: number) => {
      return state.generatedPayrolls.find(p => p.id === id) || null;
    },
    
    // Payroll Komponen getters
    getPayrollKomponenList: (state) => state.payrollKomponen,
    
    getPayrollKomponenById: (state) => (id: number) => {
      return state.payrollKomponen.find(p => p.id === id) || null;
    },
    
    // Template Payroll getters
    getTemplatePayrollList: (state) => state.templatePayroll,
    
    getTemplatePayrollById: (state) => (id: number) => {
      return state.templatePayroll.find(p => p.id === id) || null;
    },
    
    // Department getters
    getDepartmentList: (state) => state.departments,
    
    getDepartmentById: (state) => (id: number) => {
      return state.departments.find(d => d.id === id) || null;
    },
    
    // Position getters
    getPositionList: (state) => state.positions,
    
    getPositionById: (state) => (id: number) => {
      return state.positions.find(p => p.id === id) || null;
    },
    
    // Working Hour getters
    getWorkingHourList: (state) => state.workingHours,
    
    getWorkingHourById: (state) => (id: number) => {
      return state.workingHours.find(w => w.id === id) || null;
    },
    
    // Work Location getters
    getWorkLocationList: (state) => state.workLocations,
    
    getWorkLocationById: (state) => (id: number) => {
      return state.workLocations.find(w => w.id === id) || null;
    },
    
    // Loading and error getters
    isLoading: (state) => state.loading,
    
    error: (state) => state.error
  }
};

export const usePegawaiStore = () => {
  return {
    // Properties from state
    pegawaiList: computed(() => store.state.pegawai.pegawaiList),
    pegawaiPayrollList: computed(() => store.state.pegawai.pegawaiPayrollList),
    generatedPayrolls: computed(() => store.state.pegawai.generatedPayrolls),
    payrollKomponen: computed(() => store.state.pegawai.payrollKomponen),
    templatePayroll: computed(() => store.state.pegawai.templatePayroll),
    departemenList: computed(() => store.state.pegawai.departemenList),
    jabatanList: computed(() => store.state.pegawai.jabatanList),
    
    // Methods from getters
    getPegawaiById: (id: number) => store.getters['pegawai/getPegawaiById'](id),
    getPegawaiPayrollById: (id: number) => store.getters['pegawai/getPegawaiPayrollById'](id),
    getPegawaiPayrollByPegawaiId: (pegawaiId: number) => store.getters['pegawai/getPegawaiPayrollByPegawaiId'](pegawaiId),
    getPayrollKomponenById: (id: number) => store.getters['pegawai/getPayrollKomponenById'](id),
    getTemplatePayrollById: (id: number) => store.getters['pegawai/getTemplatePayrollById'](id),
    
    // Methods from actions
    fetchPegawaiList: () => store.dispatch('pegawai/fetchPegawaiList'),
    addPegawai: (pegawai: any) => store.dispatch('pegawai/addPegawai', pegawai),
    updatePegawai: (pegawai: any) => store.dispatch('pegawai/updatePegawai', pegawai),
    deletePegawai: (id: number) => store.dispatch('pegawai/deletePegawai', id),
    
    fetchPegawaiPayrollList: () => store.dispatch('pegawai/fetchPegawaiPayrollList'),
    addPegawaiPayroll: (payroll: any) => store.dispatch('pegawai/addPegawaiPayroll', payroll),
    updatePegawaiPayroll: (payroll: any) => store.dispatch('pegawai/updatePegawaiPayroll', payroll),
    deletePegawaiPayroll: (id: number) => store.dispatch('pegawai/deletePegawaiPayroll', id),
    
    fetchGeneratedPayrolls: () => store.dispatch('pegawai/fetchGeneratedPayrolls'),
    addGeneratedPayroll: (payroll: any) => store.dispatch('pegawai/addGeneratedPayroll', payroll),
    updateGeneratedPayrollStatus: (id: number, status: string) => 
      store.dispatch('pegawai/updateGeneratedPayrollStatus', { id, status }),
    deleteGeneratedPayroll: (id: number) => store.dispatch('pegawai/deleteGeneratedPayroll', id),
    
    fetchPayrollKomponen: () => store.dispatch('pegawai/fetchPayrollKomponen'),
    addPayrollKomponen: (komponen: any) => store.dispatch('pegawai/addPayrollKomponen', komponen),
    updatePayrollKomponen: (komponen: any) => store.dispatch('pegawai/updatePayrollKomponen', komponen),
    deletePayrollKomponen: (id: number) => store.dispatch('pegawai/deletePayrollKomponen', id),
    
    fetchTemplatePayroll: () => store.dispatch('pegawai/fetchTemplatePayroll'),
    addTemplatePayroll: (template: any) => store.dispatch('pegawai/addTemplatePayroll', template),
    updateTemplatePayroll: (template: any) => store.dispatch('pegawai/updateTemplatePayroll', template),
    deleteTemplatePayroll: (id: number) => store.dispatch('pegawai/deleteTemplatePayroll', id),
    
    fetchDepartments: () => store.dispatch('pegawai/fetchDepartments'),
    fetchPositions: () => store.dispatch('pegawai/fetchPositions'),
    fetchWorkingHours: () => store.dispatch('pegawai/fetchWorkingHours'),
    fetchWorkLocations: () => store.dispatch('pegawai/fetchWorkLocations'),
    
    // Status
    isLoading: computed(() => store.getters['pegawai/isLoading']),
    error: computed(() => store.getters['pegawai/error'])
  };
};