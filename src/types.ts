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

export interface Offer {
  uuid: string;
  name: string;
  age: number;
  species: string;
  breed: string;
  sex: string;
  sterile: boolean;
  description: string;
  date_published: string;
  location?: string;
  published_by: string;
}

export interface Event {
  attributes: any;
  data: string;
}
