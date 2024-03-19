export default class WebSocketService {
    ws: WebSocket | null = null;
  
    initialize(url: string) {
      this.ws = new WebSocket(url);
    }
  
    onMessage(callback: (message: any) => void) {
      if (!this.ws) return;
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        callback(message);
      };
    }
  
    sendMessage(messages: { role: string; content: string; }[]) {
      if (!this.ws) return;
      this.ws.send(JSON.stringify({ messages }));
    }
  
    close() {
      if (this.ws) {
        this.ws.close();
      }
    }
  }
  
  export const webSocketService = new WebSocketService();