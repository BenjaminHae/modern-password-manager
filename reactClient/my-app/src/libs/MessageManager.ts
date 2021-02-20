export interface IMessageOptions {
  autoClose?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  button?: IMessageButton;
}
export interface IMessageButton {
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
  handler: (()=>void);
  text: string;
}

export interface IMessage extends IMessageOptions {
  id: number;
  message: string;
  show: boolean;
}

export default class MessageManager {
  private stateChange: (messages: Array<IMessage>) => void;
  messages: Array<IMessage> = [];

  constructor (stateChange:(messages: Array<IMessage>)  => void) {
    this.stateChange = stateChange;
  }
  updateMessages(): void {
    this.stateChange(this.messages);
  }
  showMessage(text: string, options: IMessageOptions = {}): void {
    const message = {message: text, id: Date.now(), show: false, ...options}
    this.messages.push(message);
    this.updateMessages();
    if ( options.autoClose === undefined || options.autoClose) {
      window.setTimeout(() => {
        this.hideMessage(message);
      }
      , 5000);
    }
    window.setTimeout(() => {
      message.show = true; 
      this.updateMessages();
    }, 1);
  }
  hideMessage(message: IMessage): void {
    message.show = false;
    this.updateMessages();
    window.setTimeout(() => {
      this.messages = this.messages.filter((m)=> m.id !== message.id)
      this.updateMessages();
    }, 2000);
  }
  clearMessages(): void {
    for (const message of this.messages) {
      this.hideMessage(message);
    }
  }
}
