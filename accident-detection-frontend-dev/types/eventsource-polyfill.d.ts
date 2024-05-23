// eventsource-polyfill.d.ts
declare module 'eventsource-polyfill' {
    export class EventSourcePolyfill {
      constructor(url: string, eventSourceInitDict?: EventSourceInit);
      onopen: (event: MessageEvent) => void;
      onmessage: (event: MessageEvent) => void;
      onerror: (event: MessageEvent) => void;
      close: () => void;
      addEventListener: (type: string, listener: (event: MessageEvent) => void) => void;
      removeEventListener: (type: string, listener: (event: MessageEvent) => void) => void;
    }
  
    export interface EventSourceInit {
      withCredentials?: boolean;
      headers?: { [key: string]: string };
    }
  }
  