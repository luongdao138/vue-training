<script setup>
import { defineProps, computed, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  label: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "md",
  },
});

const emit = defineEmits(["update:modelValue"]);

const computedValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <q-checkbox v-model="computedValue" :label="label" :size="size" />
</template>
