import { type ClassValue, clsx } from "clsx";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { twMerge } from "tailwind-merge";
import { db, storage } from "./firebase";
import { deleteObject, ref } from "firebase/storage";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const priceFormatter = new Intl.NumberFormat(["en-US", "sv-SE"], {
  style: "currency",
  currency: "SEK",
});
