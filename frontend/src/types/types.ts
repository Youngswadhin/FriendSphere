export interface Address {
  id: string;
  city?: string;
  zip: number;
  state?: string;
  country: string;
  userId: string;
  locationId: string;
  location: Location;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  lat: number;
  long: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  sender: User;
  receiver: User;
  receiverId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  address?: Address;
  image?: string;
  hobbies: string[];
  friends: {friend:User}[];
  friendOf: User[];
  sentRequests: FriendRequest[];
  receivedRequests: FriendRequest[];
  createdAt: Date;
  updatedAt: Date;
}
