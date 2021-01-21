export interface RecommenderMessage {
  breed: string;
}

export interface Chat {
  uuid: string;
  creator: string;
  participants: string[];
}

export interface Message {
  uuid: string;
  chat: string;
  sender: string;
  date: string;
  body: string;
}
