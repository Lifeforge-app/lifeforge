// src/types/global.d.ts
export {};

declare global {
  interface Window {
    VITE_API_HOST?: string;
    VITE_LOCALIZATION_MANAGER_URL?: string;
  }
}
