<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="title-small mb-3">
      Showing {{ ((page - 1) * limit) + 1 }} to {{ Math.min(page * limit, total) }} of {{ total }}
    </div>
    <div>
      <nav class="isolate inline-flex space-x-2 rounded-md" aria-label="Pagination">
        <md-icon-button :disabled="page <= 1" @click="onChange(page - 1)">
          <md-icon v-html="icon('chevron_left')" />
        </md-icon-button>
        
        <div v-for="p in pagination(page, Math.ceil(total / limit))">
          <md-filled-tonal-icon-button v-if="page == p">
            <span class="item label-large">{{ p }}</span>
          </md-filled-tonal-icon-button>
          <md-icon-button v-else :disabled="p === '...'" @click="typeof p === 'number' ? onChange(p) : null">
            <span class="item label-large">{{ p }}</span>
          </md-icon-button>
        </div>
        
        <md-icon-button :disabled="page >= Math.ceil(total / limit)" @click="onChange(page + 1)">
          <md-icon v-html="icon('chevron_right')" />
        </md-icon-button>
      </nav>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { icon } from '~/utils/icon';
import { pagination } from '~/utils/pagination';

import "@material/web/icon/icon";
import "@material/web/iconbutton/icon-button";
import "@material/web/iconbutton/filled-tonal-icon-button";

defineProps<{
  total: number;
  limit: number;
  page: number;
  onChange: (page: number) => void;
}>();
</script>

<style lang="scss" scoped>
.item {
  @apply font-medium flex items-center justify-center;
}
</style>