<template>
  <div class="container mx-auto px-6 py-12 flex items-center">
    <div class="flex items-center justify-center w-full h-full">
      <div class="">
        <h2 class="text-2xl md:text-3xl font-semibold mb-1 text-on-surface-variant" data-sal="zoom-in">
          Admin
        </h2>
        <h6 class="text-sm" data-sal="zoom-in" data-sal-delay="50">
          Unauthorized access is prohibited.
        </h6>

        <div class="flex flex-col gap-1 my-10">
          <md-outlined-text-field
            :disabled="isLoggingIn"
            label="Student ID"
            type="text"
            maxLength="8"
            hasLeadingIcon="true"
            @keydown.enter="login"
            v-model.trim="id"
            data-sal="zoom-in"
            data-sal-delay="100"
            required
          >
            <md-icon slot="leading-icon" v-html="icon('badge', true)" />
          </md-outlined-text-field>

          <md-outlined-text-field
            :disabled="isLoggingIn"
            label="Password"
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model.trim="password"
            @keydown.enter="login"
            data-sal="zoom-in"
            data-sal-delay="150"
            required
          >
            <md-icon slot="leading-icon" v-html="icon('lock', true)" />
            <md-icon-button slot="trailing-icon" @click="isPasswordVisible = !isPasswordVisible" toggle>
              <md-icon v-html="icon('visibility_off', true)" />
              <md-icon slot="selected" v-html="icon('visibility', true)" />
            </md-icon-button>
          </md-outlined-text-field>
        </div>

        <div class="flex justify-center" data-sal="zoom-in" data-sal-delay="250">
          <md-filled-button @click="login" class="w-full" :disabled="isLoggingIn">
            {{ isLoggingIn ? 'Logging in...' : 'Login' }}
          </md-filled-button>
        </div>

      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import "@material/web/textfield/outlined-text-field";
import "@material/web/iconbutton/icon-button";
import "@material/web/button/filled-button";

import { ref, onMounted } from "vue";
import { icon } from "~/utils/icon";
import { toast } from "vue3-toastify";
import { useStore } from "~/store";
import { useRouter } from "vue-router";
import { Endpoints, makeRequest } from "~/network/request";
import { setStore } from "~/utils/storage";
import sal from "sal.js";

const store = useStore();
const router = useRouter();

const id = ref("");
const password = ref("");

const isLoggingIn = ref(false);
const isPasswordVisible = ref(false);

onMounted(() => {
  sal();
});

/**
 * Login to the system
 */
function login() {
  // If id is empty
  if (!id.value) {
    toast.info("Empty student ID");
    return;
  }

  // If password is empty
  if (!password.value) {
    toast.info("Empty password");
    return;
  }

  // If already logging in
  if (isLoggingIn.value) return;
  isLoggingIn.value = true;
  store.isLoading = true;
  
  // Make request to server
  makeRequest<LoginResponse>("POST", Endpoints.AdminLogin, {
    id: id.value,
    password: password.value
  }, (response) => {
    isLoggingIn.value = false;
    store.isLoading = false;

    // if success
    if (response.success) {
      // Save token to local storage
      setStore("adm_token", response.data.token);
      // Set student
      store.admin = response.data.student;
      // Set is logged in to true
      store.isAdminLoggedIn = true;
      // Redirect to home page
      router.push({ name: "Admin", params: { tab: "dashboard" } });
      return;
    }

    toast.error(response.message);
  });
}
</script>