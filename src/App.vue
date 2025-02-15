<template>
  <div class="min-h-screen">
    <md-linear-progress class="fixed right-0 left-0 top-0 min-w-full z-[1]" :indeterminate="store.isLoading" />

    <div>
      <VNavigationRail
        :class="{ 'translate-x-0': route.path.startsWith('/admin') && charCount('/', route.path) === 2 && !route.path.endsWith('/login') }"
        class="hidden md:block fixed top-0 bottom-0 -translate-x-[80px]"
        :selected="route.params.tab as string"
        :destinations="store.rails"
        @select="id => store.selectedRail = id"
      />
      
      <div class="flex flex-col min-h-screen justify-between">
        <VAppBar :class="{ 'pl-0 md:pl-[80px]': route.path.startsWith('/admin') && charCount('/', route.path) === 2 && !route.path.endsWith('/login') }" transparent />
        <router-view v-slot="{ Component }">
          <Transition name="slide-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
        <VFooter :class="{ 'flex-grow': route.name === 'Admin' || (store.isLoggedIn && route.name === 'My Orders') }" />
      </div>
    </div>

    <DialogMain />
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { Env } from './config';
import { useStore } from './store';
import { removeStore } from './utils/storage';
import { toast } from 'vue3-toastify';
import { Endpoints, makeRequest } from './network/request';
import { isAdminLoginValid, isLoginValid } from './utils/network';
import { charCount } from "./utils/string";

import "@material/web/progress/linear-progress";

import VAppBar from './components/VAppBar.vue';
import VFooter from './components/VFooter.vue';
import DialogMain from './components/dialogs/DialogMain.vue';
import VNavigationRail from "./components/VNavigationRail.vue";

// Get store
const store = useStore();
const route = useRoute();

store.isLoading = true;

// Fetch courses
makeRequest<string[]>("GET", Endpoints.Courses, null, response => {
  if (response.success) {
    store.courses = response.data;
    return;
  }

  toast.error(response.message);
});

makeRequest<any>("GET", Endpoints.Env, null, response => {
  store.isLoading = false;

  if (response.success) {
    for (const key in response.data) {
      Env[key] = response.data[key];
    }

    // Check if login is valid
    isLoginValid(valid => {
      // Set loading to false
      store.isLoading = false;

      // If is valid
      if (valid) {
        // Set logged in
        store.isLoggedIn = true;
        // return
        return;
      }

      // If not valid, clear local storage
      removeStore("std_token");
      // Set logged out
      store.isLoggedIn = false;
    });

    isAdminLoginValid(isAdminLoginValid => {
      /// Set loading to false
      store.isLoading = false;

      // If is valid
      if (isAdminLoginValid) {
        // Set admin logged in
        store.isAdminLoggedIn = true;
        // return
        return;
      }

      // If not valid, clear local storage
      removeStore("adm_token");
      // Set logged out
      store.isAdminLoggedIn = false;
    });

    return;
  }

  toast.error(response.message);

  if (response.data === "UNAUTHORIZED") {
    removeStore("std_token");
    removeStore("adm_token");
    store.isLoggedIn = false;
    store.isAdminLoggedIn = false;
  }
});
</script>