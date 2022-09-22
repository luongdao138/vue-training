<script setup>
defineProps({
  label: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="flex items-center">
    <p class="font-semibold w-40">
      {{ label }}: <span v-if="required" class="text-red-500">(*)</span>
    </p>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>
