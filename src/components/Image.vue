<template>
  <img v-if="Boolean(image_url)" :src="(image_url as string)" alt="" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { defineProps, onMounted } from "vue";
const image_url = ref<string | null>(null);

interface Props {
  url: string;
}

const props = defineProps<Props>();

onMounted(async () => {
  const res = await fetch(props.url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("vue_training_token")}`,
    },
  });

  const imageBlob = await res.blob();
  const imageObjectURL = URL.createObjectURL(imageBlob);
  image_url.value = imageObjectURL;
});
</script>
