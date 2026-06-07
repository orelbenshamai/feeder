export {};

declare global {
    interface Window {
      fbq: (type: string, event: string, data?: object) => void;
    }
  }