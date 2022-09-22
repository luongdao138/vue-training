<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  canResize: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:modelValue"]);

const computedValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:modelValue", value);
  },
});

const inputStyle = computed(() => {
  let style = {};

  if (props.canResize) {
    style.resize = "vertical";
  } else {
    style.resize = "none";
  }

  return style;
});
</script>

<template>
  <div class="w-full">
    <q-input
      v-model="computedValue"
      :input-style="{ ...inputStyle, ...$attrs.inputStyle }"
      class="w-full"
      filled
      type="textarea"
    />
  </div>
</template>
