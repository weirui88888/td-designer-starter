export {};

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, payload: Record<string, any>) => void;
      identify: (id: string, payload?: Record<string, any>) => void;
    };
  }
}
