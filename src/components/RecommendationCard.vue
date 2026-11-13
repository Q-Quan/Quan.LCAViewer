<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
  theKey: string,
  title: string,
  description: string,
  isMain: boolean
}>()
</script>

<template>
  <div class="card p-2 mb-2" :class="{'border-primary': isMain}">
    <h6 class="mb-0"><span class="badge" :class="{'badge-primary bg-primary': isMain, 'text-dark bg-light': !isMain}">{{ theKey }}</span> <small>{{ title }}</small></h6>
    <p class="mb-0"><small>{{ description }}</small></p>
  </div>
</template>

<style scoped>
.card {
  line-height: 1.2;
}
</style>
