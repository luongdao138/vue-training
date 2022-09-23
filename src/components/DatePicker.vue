<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  dateMask: {
    type: String,
    default: "DD-MM-YYYY",
  },
  inputMask: {
    type: String,
    default: "##-##-####",
  },
  inputRules: {
    type: Object,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: [(val) => Boolean(val) || "Date can not be empty"],
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
  <q-input
    v-model="computedValue"
    :input-style="{ backgroundColor: 'unset' }"
    filled
    :mask="inputMask"
    :rules="inputRules"
  >
    <template #append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="computedValue" :mask="dateMask">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<style>
.q-field {
  padding: 0 !important;
}
</style>
