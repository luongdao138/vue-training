<script lang="ts">
import { mdiAccount, mdiAsterisk } from '@mdi/js';
import SectionFullScreen from '@/components/SectionFullScreen.vue';
import CardBox from '@/components/CardBox.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import LayoutGuest from '@/layouts/LayoutGuest.vue';
import { defineComponent } from 'vue';
import { login } from '@/services/auth';
import { mapActions, mapStores, mapState } from 'pinia';
import { useAuth } from '@/stores/auth';

export default defineComponent({
  components: {
    SectionFullScreen,
    CardBox,
    FormField,
    FormControl,
    BaseButton,
    BaseButtons,
    LayoutGuest,
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      mdiAccount,
      mdiAsterisk,
    };
  },
  methods: {
    async handleLogin() {
      try {
        const res = await login({ ...this.form });
        localStorage.setItem('vue_training_token', res.data.token);
        this.$router.push('/dashboard');
      } catch (error) {
        console.log(error);
      }
    },
    ...mapActions(useAuth, ['loginSuccess']),
  },
  computed: {
    ...mapStores(useAuth),
    ...mapState(useAuth, ['user']),
  },
});
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="handleLogin">
        <FormField label="Username" help="Please enter your username">
          <FormControl
            v-model="form.email"
            :icon="mdiAccount"
            name="username"
            autocomplete="username"
          />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.password"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Login" />
            <BaseButton to="/dashboard" color="info" outline label="Back" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
