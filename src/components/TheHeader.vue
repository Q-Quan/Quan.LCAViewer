<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
  title: string,
  description: string,
}>()

document.title = props.title;
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-md bg-primary navbar-dark">
      <div class="container">
        <a class="navbar-brand me-auto" href="#">
          <span class="fw-bold me-2">{{ title }}</span> <br class="d-md-none" />
        </a>
        <span class="navbar-text ms-auto d-none d-sm-inline-block">
          :-)
        </span>
      </div>
    </nav>
    <nav class="navbar navbar-expand-xs bg-light py-0" v-if="description">
      <div class="container">
        <p class="my-3 text-dark">{{ description }}</p>
      </div>
    </nav>
  </header>
</template>

<style scoped>

</style>
