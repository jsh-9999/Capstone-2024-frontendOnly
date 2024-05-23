declare module 'event-source-polyfill' {
    export interface EventSourceInitDict {
      withCredentials?: boolean;
      headers?: { [key: string]: string };
    }
  
    export class EventSourcePolyfill {
      constructor(url: string, eventSourceInitDict?: EventSourceInitDict);
      onopen: ((this: EventSourcePolyfill, ev: MessageEvent) => any) | null;
      onmessage: ((this: EventSourcePolyfill, ev: MessageEvent) => any) | null;
      onerror: ((this: EventSourcePolyfill, ev: MessageEvent) => any) | null;
      close(): void;
      addEventListener(type: string, listener: (this: EventSourcePolyfill, ev: MessageEvent) => any): void;
      removeEventListener(type: string, listener?: (this: EventSourcePolyfill, ev: MessageEvent) => any): void;
      dispatchEvent(evt: Event): boolean;
    }
  }
  