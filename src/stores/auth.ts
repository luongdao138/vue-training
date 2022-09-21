import { getCurrentUser } from '@/services/auth';
import { AuthUser } from '@/services/auth';
import { defineStore } from 'pinia';

export interface AuthState {
  user: AuthUser | null;
}

export const useAuth = defineStore('auth', {
  state(): AuthState {
    return {
      user: null,
    };
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
  getters() {
    is_authenticated: (): boolean => Boolean(this.user);
  },
});
