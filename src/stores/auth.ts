import { getCurrentUser } from "@/services/auth";
import { AuthUser } from "@/services/auth";
import { defineStore } from "pinia";

export interface AuthState {
  user: AuthUser | null;
}

export const useAuth = defineStore("auth", {
  state: (): AuthState => {
    return {
      user: null,
    };
  },
  getters: {
    is_authenticated(): boolean {
      return Boolean(this.user);
    },
  },
  actions: {
    loginSuccess(user: AuthUser) {
      this.user = user;
    },
    async getCurrentAuthUser() {
      try {
        const res = await getCurrentUser();
        this.user = res.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
