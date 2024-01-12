<script setup lang="ts">
import { ref, computed, type Ref, toRefs, watch, onMounted, type ComputedRef } from 'vue'

const props = defineProps<{
  text: string,
}>()

</script>
<template>
    <span class="btn btn-link px-0 py-0" v-tooltip="text">
        <i class="fa-sharp fa-regular fa-circle-question"></i>
    </span>
</template>
<style scoped>
  span {
    display: inline-block;
    margin-top: -4px;
  }
</style>