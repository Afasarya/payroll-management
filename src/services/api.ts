import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Environment variables would be better but for this example we'll hardcode
const BASE_URL = 'http://127.0.0.1:8000/'; // Update with your real API base URL
const TENANT = 'test-tenant'; // Update with your tenant name

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}${TENANT}/`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication service
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    try {
      await apiClient.post('logout');
      localStorage.removeItem('token');
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
};

// Employee service
export const employeeService = {
  getEmployees: async (search: string = '', page: number = 1) => {
    try {
      const response = await apiClient.get('employee/', {
        params: { search, page }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getEmployeeById: async (id: number) => {
    try {
      const response = await apiClient.get(`employee/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createEmployee: async (employeeData: any) => {
    try {
      const response = await apiClient.post('employee/create', employeeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateEmployee: async (id: number, employeeData: any) => {
    try {
      const response = await apiClient.put(`employee/update/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteEmployee: async (id: number) => {
    try {
      const response = await apiClient.delete(`employee/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Payroll service
export const payrollService = {
  getGeneratedPayrolls: async (project_id: string = '') => {
    try {
      const response = await apiClient.get('payroll_draft/index', {
        data: { project_id }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPayrollById: async (id: string) => {
    try {
      const response = await apiClient.get(`payroll_draft/read/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createPayroll: async (payrollData: any) => {
    try {
      const response = await apiClient.post('payroll_draft/store', payrollData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updatePayrollStatus: async (id: string, status: string) => {
    try {
      const response = await apiClient.put(`payroll_draft/updateStatus/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deletePayroll: async (id: string) => {
    try {
      const response = await apiClient.delete(`payroll_draft/destroy/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Employee Payroll service
export const employeePayrollService = {
  getEmployeePayrolls: async (search: string = '') => {
    try {
      const response = await apiClient.get('PaymentRequestDetail/', {
        data: { search }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getEmployeePayrollById: async (id: string) => {
    try {
      const response = await apiClient.get(`PaymentRequestDetail/show/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createEmployeePayroll: async (payrollData: any) => {
    try {
      const response = await apiClient.post('PaymentRequestDetail/store', payrollData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateEmployeePayroll: async (id: string, payrollData: any) => {
    try {
      const response = await apiClient.put(`PaymentRequestDetail/update/${id}`, payrollData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteEmployeePayroll: async (id: string) => {
    try {
      const response = await apiClient.delete(`PaymentRequestDetail/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Department service
export const departmentService = {
  getDepartments: async (search: string = '') => {
    try {
      const response = await apiClient.get('department/', {
        data: { search }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getDepartmentById: async (id: number) => {
    try {
      const response = await apiClient.get(`department/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createDepartment: async (departmentData: any) => {
    try {
      const response = await apiClient.post('department/store', departmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateDepartment: async (id: number, departmentData: any) => {
    try {
      const response = await apiClient.put(`department/update/${id}`, departmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteDepartment: async (id: number) => {
    try {
      const response = await apiClient.delete(`department/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Position service
export const positionService = {
  getPositions: async (search: string = '') => {
    try {
      const response = await apiClient.get('position/', {
        data: { search }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPositionById: async (id: number) => {
    try {
      const response = await apiClient.get(`position/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createPosition: async (positionData: any) => {
    try {
      const response = await apiClient.post('position/store', positionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updatePosition: async (id: number, positionData: any) => {
    try {
      const response = await apiClient.put(`position/update/${id}`, positionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deletePosition: async (id: number) => {
    try {
      const response = await apiClient.delete(`position/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Payroll Component service
export const payrollComponentService = {
  getPayrollComponents: async (search: string = '') => {
    try {
      const response = await apiClient.get('payroll_component/', {
        data: { search }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPayrollComponentById: async (id: number) => {
    try {
      const response = await apiClient.get(`payroll_component/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createPayrollComponent: async (componentData: any) => {
    try {
      const response = await apiClient.post('payroll_component/store', componentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updatePayrollComponent: async (id: number, componentData: any) => {
    try {
      const response = await apiClient.put(`payroll_component/update/${id}`, componentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deletePayrollComponent: async (id: number) => {
    try {
      const response = await apiClient.delete(`payroll_component/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Working Hour service
export const workingHourService = {
  getWorkingHours: async () => {
    try {
      const response = await apiClient.get('workinghour/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getWorkingHourById: async (id: number) => {
    try {
      const response = await apiClient.get(`workinghour/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Work Location service
export const workLocationService = {
  getWorkLocations: async (search: string = '') => {
    try {
      const response = await apiClient.get('worklocation/', {
        data: { search }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getWorkLocationById: async (id: number) => {
    try {
      const response = await apiClient.get(`worklocation/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Template Payroll service
export const templatePayrollService = {
  getTemplatePayrolls: async () => {
    try {
      const response = await apiClient.get('template-payroll/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getTemplatePayrollById: async (id: number) => {
    try {
      const response = await apiClient.get(`template-payroll/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createTemplatePayroll: async (templateData: any) => {
    try {
      const response = await apiClient.post('template-payroll/store', templateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateTemplatePayroll: async (id: number, templateData: any) => {
    try {
      const response = await apiClient.put(`template-payroll/update/${id}`, templateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteTemplatePayroll: async (id: number) => {
    try {
      const response = await apiClient.delete(`template-payroll/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default apiClient;