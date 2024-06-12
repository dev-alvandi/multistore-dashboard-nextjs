import { db } from "@/lib/firebase";
import { Store } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();

    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const { name } = body;

    if (!name) {
      return new NextResponse("Name is missing!", { status: 400 });
    }

    const storeData = {
      name,
      userId,
      createdAt: serverTimestamp(),
    } as Store;

    // Add the data to the firestore and return its ref id
    const storeRef = await addDoc(collection(db, "stores"), storeData);

    // Get the ref Id
    const id = storeRef.id;

    await updateDoc(doc(db, "stores", id), {
      ...storeData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ msg: "Store created" });
  } catch (error) {
    console.log(`STORE_POST: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
