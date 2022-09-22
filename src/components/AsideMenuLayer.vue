<script setup>
import { mdiLogout } from "@mdi/js";
import { computed, ref } from "vue";
import { useStyleStore } from "@/stores/style.js";
import AsideMenuList from "@/components/AsideMenuList.vue";
import AsideMenuItem from "@/components/AsideMenuItem.vue";
import { useAuth } from "../stores/auth.ts";
import { storeToRefs } from "pinia";
import Image from "@/components/Image.vue";

defineProps({
  menu: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["menu-click", "aside-lg-close-click"]);

const styleStore = useStyleStore();

const logoutItem = computed(() => ({
  label: "Logout",
  icon: mdiLogout,
  color: "info",
  isLogout: true,
}));

const menuClick = (event, item) => {
  emit("menu-click", event, item);
};

// const asideLgCloseClick = (event) => {
//   emit("aside-lg-close-click", event);
// };

// pinia state
const authStore = useAuth();
const { user } = storeToRefs(authStore);
</script>

<template>
  <aside
    id="aside"
    class="lg:py-2 lg:pl-2 w-60 fixed flex z-40 top-0 h-screen transition-position overflow-hidden"
  >
    <div
      :class="styleStore.asideStyle"
      class="lg:rounded-2xl flex-1 flex flex-col overflow-hidden dark:bg-slate-900"
    >
      <div
        :class="styleStore.asideBrandStyle"
        class="flex flex-row flex-nowrap h-18 p-4 items-center dark:bg-slate-900"
      >
        <q-avatar class="mr-2" size="36px">
          <Image :url="user.avatar" />
        </q-avatar>

        <h3 class="text-sm font-medium">Welcome, {{ user.name }}</h3>
      </div>
      <div
        :class="
          styleStore.darkMode
            ? 'aside-scrollbars-[slate]'
            : styleStore.asideScrollbarsStyle
        "
        class="flex-1 overflow-y-auto overflow-x-hidden"
      >
        <AsideMenuList :menu="menu" @menu-click="menuClick" />
      </div>

      <ul>
        <AsideMenuItem :item="logoutItem" @menu-click="menuClick" />
      </ul>
    </div>
  </aside>
</template>
