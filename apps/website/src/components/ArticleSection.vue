<script setup lang="ts">
defineProps<{ header?: string }>();
</script>

<template>
  <section class="flex flex-column p-4 border-round-2xl">
    <div class="justify-content-center text-5xl font-bold mb-2 flex align-items-center">
      <slot name="header">
        {{ header }}
      </slot>
    </div>
    <slot />
  </section>
</template>

<style scoped>
section {
  background-color: rgba(28, 28, 28, 0.55);
  width: 95%;
}
</style>
