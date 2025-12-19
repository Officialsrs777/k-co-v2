import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create((set) => ({
  user: null,

  isSigningIn: false,
  isSigningUp: false,
  isVerifying: false,

  error: null,

  /* ================= SIGN UP ================= */
  signUp: async (payload) => {
    set({ isSigningUp: true, error: null });

    try {
      const res = await axios.post(`${API_URL}/auth/signup`, payload);

      
      set({
        user: res.data.user,
        isSigningUp: false
      });

      
      return { success: true, message: res.data.message };
    } catch (err) {
      set({
        isSigningUp: false,
        error: err.response?.data?.message || "Signup failed"
      });

      return { success: false, message: err.response?.data?.message };
    }
  },

  /* ================= SIGN IN ================= */
  signIn: async ({ email, password }) => {
    set({ isSigningIn: true, error: null });

    try {
      const res = await axios.post(`${API_URL}/auth/signin`, {
        email,
        password
      });

      set({
        user: res.data.user,
        isSigningIn: false
      });

      

      return { success: true };
    } catch (err) {
      set({
        isSigningIn: false,
        error: err.response?.data?.message || "Login failed"
      });

      return { success: false, message: err.response?.data?.message };
    }
  },

  /* ================= VERIFY EMAIL ================= */
  verifyEmail: async ({ email, otp }) => {
    set({ isVerifying: true, error: null });

    try {
      const res = await axios.post(`${API_URL}/auth/verify-email`, {
        email,
        otp
      });

      set({
        user: res.data.user,
        isVerifying: false
      });

      return { success: true, message: res.data.message };
    } catch (err) {
      set({
        isVerifying: false,
        error: err.response?.data?.message || "Verification failed"
      });

      return { success: false, message: err.response?.data?.message };
    }
  },

  /* ================= LOGOUT ================= */
  logout: async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      set({
        user: null,
      });
    }
  }
}));
