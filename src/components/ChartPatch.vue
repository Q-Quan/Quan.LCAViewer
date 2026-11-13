<script setup lang="ts">
import { ref, computed, type Ref, toRefs, watch, onMounted } from 'vue'

const props = defineProps<{
  patch: string | CanvasPattern
}>()

const { patch } = toRefs(props);

const canvasElement = ref(null);

onMounted(() => {
  const canvas = (canvasElement as unknown as Ref<HTMLCanvasElement>).value;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = patch.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
})
</script>

<template>
  <span class="patch">
    <canvas ref="canvasElement" width="32" height="13"></canvas>
  </span>
</template>

<style lang="scss" scoped>

.patch {
  display: inline-block;
  width: 2rem;
  height: 0.8em;
  margin-right: 0.25em;
  transform: translateY(7.5%);

  > canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
