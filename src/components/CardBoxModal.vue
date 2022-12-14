<script>
// use normal <script> to declare options
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { computed } from "vue";
import { mdiClose } from "@mdi/js";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import LoadingOverlay from "./LoadingOverlay.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  button: {
    type: String,
    default: "info",
  },
  buttonLabel: {
    type: String,
    default: "Done",
  },
  hasCancel: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: null,
  },
  confirmOnClickOverlay: {
    type: Boolean,
    default: false,
  },
  disableSubmitBtn: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "cancel", "confirm"]);

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const confirmCancel = (mode) => {
  value.value = false;
  emit(mode);
};

const onConfirm = () => confirmCancel("confirm");

const cancel = () => confirmCancel("cancel");

const onClose = () => {
  if (!props.confirmOnClickOverlay) {
    cancel();
    return;
  }

  if (confirm("Close this form")) {
    cancel();
  }
};

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && value.value) {
    cancel();
  }
});
</script>

<template>
  <OverlayLayer v-show="value" @overlay-click="onClose">
    <CardBox
      v-show="value"
      class="shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-2/5 xl:w-4/12 z-50"
      is-modal
      :style="$attrs.style"
    >
      <CardBoxComponentTitle class="font-semibold" :title="title">
        <BaseButton
          v-if="hasCancel"
          :icon="mdiClose"
          color="whiteDark"
          small
          rounded-full
          @click.prevent="cancel"
        />
      </CardBoxComponentTitle>

      <div v-if="!loading" class="space-y-3">
        <slot />
      </div>
      <div v-if="loading" class="flex justify-center mt-20 mb-10">
        <LoadingOverlay />
      </div>

      <template #footer>
        <div class="flex justify-end">
          <BaseButtons>
            <BaseButton
              :label="buttonLabel"
              :disabled="disableSubmitBtn"
              :color="button"
              @click="onConfirm"
            />
            <BaseButton
              v-if="hasCancel"
              label="Cancel"
              :color="button"
              outline
              @click="cancel"
            />
          </BaseButtons>
        </div>
      </template>
    </CardBox>
  </OverlayLayer>
</template>
