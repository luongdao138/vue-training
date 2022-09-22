<script setup>
import { mdiCog } from '@mdi/js';
import { ref, computed, reactive } from 'vue';
import BaseIcon from '@/components/BaseIcon.vue';
import BaseButton from '@/components/BaseButton.vue';
import IconRounded from '@/components/IconRounded.vue';
defineProps({
  icon: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  main: Boolean,
});

const modal = ref(null);
const endDate = ref(null);
const startDate = ref(null);
const handleOnClickChangeDate = ref(false);
const formType = ref('fromList');
const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};
const submit = () => {
  console.log(form.chooseFromList);
};
const selectOptions = [
  { id: 1, label: 'This month' },
  { id: 2, label: 'Last month' },
  { id: 3, label: 'Today' },
  { id: 4, label: 'Yesterday' },
];
const form = reactive({
  chooseFromList: selectOptions[0],
  from: '',
  to: '',
});
console.log(formType.value);
const disableSelect = () => {
  return formType.value !== 'fromList';
};
</script>

<template>
  <section>
    <section
      :class="{ 'pt-6': !main }"
      class="mb-6 flex items-center justify-between"
    >
      <div class="flex items-center justify-start">
        <IconRounded
          v-if="icon && main"
          :icon="icon"
          color="light"
          class="mr-3"
          bg
        />
        <BaseIcon v-else-if="icon" :path="icon" class="mr-2" size="20" />
        <h1 :class="main ? 'text-3xl' : 'text-2xl'" class="leading-tight">
          {{ title }}
        </h1>
      </div>
      <slot v-if="hasSlot" />
      <BaseButton
        v-else
        :icon="mdiCog"
        color="whiteDark"
        @click="handleOnClickChangeDate = true"
      />
    </section>
    <section>
      <q-form
        ref="form"
        class="q-gutter-md"
        @submit="onSubmit"
        @reset="onReset"
      >
        <div class="row">
          <q-radio
            v-model="formType"
            left-label
            val="fromList"
            class="radio-btn justify-between"
            label="Choose from list:"
          ></q-radio>
          <q-select
            v-model="modal"
            style="min-width: 200px"
            class="q-ml-sm"
            :disable="disableSelect()"
            outlined
            :options="selectOptions"
            :option-value="id"
            :option-label="label"
            map-options
            emit-value
          >
            <!-- <template #prepend>
              <q-icon name="name"></q-icon>
            </template> -->
          </q-select>
        </div>
        <div class="row">
          <q-radio
            v-model="formType"
            left-label
            val="startEnd"
            class="radio-btn justify-between"
            label="Choose start, end:"
          ></q-radio>
          <Datepicker
            v-model="startDate"
            :format="format"
            class="q-ml-sm"
            :disabled="!disableSelect()"
          />
        </div>
        <div class="row">
          <Datepicker
            v-model="endDate"
            :disabled="!disableSelect()"
            :format="format"
            class="q-ml-sm"
            style="padding-left: 180px"
          />
        </div>
        <div>
          <q-btn
            label="Search"
            type="submit"
            color="primary"
            flat
            class="q-ml-sm"
          ></q-btn>
        </div>
      </q-form>
    </section>
  </section>
</template>

<style scoped>
.radio-btn {
  width: 180px;
}
</style>
