export interface State {
  users: string[]
  userId: string
  $dom: { [key: string]: null | HTMLElement }
}

export enum WsMessageTypes {
  message = 'message',
  connection = 'connection',
  userList = 'users',
}

export interface IWsMessage {
  type: WsMessageTypes
  from?: string
  to?: string
  payload: any
}

export interface IMessage {
  id?: string
  date: string
  text: string
}

export interface WsMessageMessage extends IWsMessage {
  type: WsMessageTypes.message
  payload: IMessage
}

export interface WsMessageUsers extends IWsMessage {
  type: WsMessageTypes.userList
  payload: {
    users: string[]
  }
}

export interface WsMessageConnection extends IWsMessage {
  type: WsMessageTypes.connection
  payload: {
    id: string
  }
}

export type WsMessage = WsMessageConnection | WsMessageUsers | WsMessageMessage
