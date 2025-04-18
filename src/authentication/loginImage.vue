<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Keep existing layout -->
      <div class="col-xl-7 b-center bg-size"
        :style="{ backgroundImage: 'url(' + require('@/assets/images/login/2.jpg') + ')' }">
        <img class="bg-img-cover bg-center d-none" src="@/assets/images/login/2.jpg" alt="loginpage" />
      </div>
      
      <div class="col-xl-5 p-0">
        <div class="login-card login-dark">
          <div>
            <div>
              <a class="logo">
                <router-link to="/">
                  <img class="img-fluid for-light" src="@/assets/images/logo/logo_new.png" alt="loginpage" />
                  <img class="img-fluid for-dark" src="@/assets/images/logo/logo_new.png" alt="loginpage" />
                </router-link>
              </a>
            </div>
            <div class="login-main">
              <form class="theme-form" @submit.prevent="handleLogin">
                <h4>Sign in to account</h4>
                <p>Enter your email & password to login</p>
                
                <div v-if="errorMessage" class="alert alert-danger">
                  {{ errorMessage }}
                </div>
                
                <div class="form-group">
                  <label class="col-form-label">Email Address</label>
                  <input
                    class="form-control"
                    type="email"
                    v-model="email"
                    required
                    placeholder="Test@gmail.com"
                  />
                </div>
                
                <div class="form-group">
                  <label class="col-form-label">Password</label>
                  <div class="form-input position-relative">
                    <input
                      class="form-control"
                      :type="type"
                      v-model="password"
                      name="login[password]"
                      required
                      placeholder="*********"
                    />
                    <div class="show-hide">
                      <span class="show" @click="showPassword"> </span>
                    </div>
                  </div>
                </div>
                
                <div class="form-group mb-0">
                  <div class="checkbox p-0">
                    <input id="checkbox1" type="checkbox" v-model="rememberMe" />
                    <label class="text-muted" for="checkbox1">Remember password</label>
                  </div>
                  
                  <button class="btn btn-primary btn-block w-100" type="submit" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ isLoading ? 'Signing in...' : 'Sign in' }}
                  </button>
                </div>
                
                <!-- Keep social login options if needed -->
                <h6 class="text-muted mt-4 or">Or Sign in with</h6>
                <div class="social mt-4">
                  <div class="btn-showcase">
                    <!-- Keep social buttons -->
                  </div>
                </div>
                
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/services/api";

const router = useRouter();
const type = ref<string>("password");
const email = ref<string>("");
const password = ref<string>("");
const rememberMe = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>("");

function showPassword() {
  if (type.value === "password") {
    type.value = "text";
  } else {
    type.value = "password";
  }
}

async function handleLogin() {
  try {
    errorMessage.value = "";
    isLoading.value = true;
    
    const response = await authService.login(email.value, password.value);
    
    // Store user data and token
    localStorage.setItem("user", JSON.stringify(response.user || {}));
    localStorage.setItem("token", response.token);
    
    // Navigate to dashboard
    router.push("/dashboards/dashboard_default");
    
  } catch (error: any) {
    console.error("Login failed:", error);
    errorMessage.value = error.response?.data?.message || "Invalid email or password. Please try again.";
  } finally {
    isLoading.value = false;
  }
}
</script>