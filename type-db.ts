import { Timestamp } from "firebase/firestore";

export interface Store {
  id: string;
  name: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: string;
  billboardId: string;
  billboardLabel: string;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Size {
  id: string;
  name: string;
  value: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Kitchen {
  id: string;
  name: string;
  value: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Cuisine {
  id: string;
  name: string;
  value: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  qty?: number;
  images: { url: string }[];
  isFeatured: boolean;
  isArchived: boolean;
  category: string;
  size: string;
  kitchen: string;
  cuisine: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Order {
  id: string;
  isPaid: boolean;
  phone: string;
  orderItems: Product[];
  address: string;
  orderStatus: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
