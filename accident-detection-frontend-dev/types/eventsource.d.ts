declare module 'eventsource' {
    interface EventSourceInitDict {
      withCredentials?: boolean;
      headers?: { [key: string]: string };
    }
  
    interface MessageEvent {
      data: string;
    }
  
    interface EventSource {
      new(url: string, eventSourceInitDict?: EventSourceInitDict): EventSource;
      readonly url: string;
      readonly readyState: number;
      readonly withCredentials: boolean;
      onopen: ((this: EventSource, ev: MessageEvent) => any) | null;
      onmessage: ((this: EventSource, ev: MessageEvent) => any) | null;
      onerror: ((this: EventSource, ev: MessageEvent) => any) | null;
      close(): void;
      addEventListener(type: string, listener: (this: EventSource, ev: MessageEvent) => any): void;
      removeEventListener(type: string, listener?: (this: EventSource, ev: MessageEvent) => any): void;
      dispatchEvent(evt: Event): boolean;
    }
  
    const EventSource: {
      prototype: EventSource;
      new(url: string, eventSourceInitDict?: EventSourceInitDict): EventSource;
      CONNECTING: number;
      OPEN: number;
      CLOSED: number;
    };
  
    export default EventSource;
  }
  