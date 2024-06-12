import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Kitchen, Store } from "@/type-db";
import { db } from "@/lib/firebase";

interface BodyProps {
  name: string;
  value: string;
}

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; kitchenId: string } }
) => {
  try {
    const { userId } = auth();

    const body: BodyProps = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.kitchenId) {
      return new NextResponse("Kitchen id is required", { status: 400 });
    }

    const { name, value } = body;

    if (!name) {
      return new NextResponse("Kitchen name is missing", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Kitchen value is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const kitchenRef = await getDoc(
      doc(db, "stores", params.storeId, "kitchens", params.kitchenId)
    );

    if (!kitchenRef.exists()) {
      return new NextResponse("Kitchen does not exist", { status: 400 });
    }

    await updateDoc(
      doc(db, "stores", params.storeId, "kitchens", params.kitchenId),
      {
        ...kitchenRef.data,
        name,
        value,
        updatedAt: serverTimestamp(),
      }
    );

    const updatedKitchen = (
      await getDoc(
        doc(db, "stores", params.storeId, "kitchens", params.kitchenId)
      )
    ).data() as Kitchen;

    return NextResponse.json(updatedKitchen);
  } catch (error) {
    console.log(`KITCHEN_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; kitchenId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.kitchenId) {
      return new NextResponse("Kitchen id is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const kitchenRef = doc(
      db,
      "stores",
      params.storeId,
      "kitchens",
      params.kitchenId
    );

    if (!kitchenRef) {
      return new NextResponse("Kitchen does not exist", { status: 400 });
    }

    await deleteDoc(kitchenRef);

    return NextResponse.json({ msg: "Kitchen deleted" });
  } catch (error) {
    console.log(`KITCHEN_DELETE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

// GET a single category
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string; kitchenId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.kitchenId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const requestedKitchen = await getDoc(
      doc(db, "stores", params.storeId, "kitchens", params.kitchenId)
    );

    if (!requestedKitchen.exists()) {
      return new NextResponse("Kitchen not found", { status: 404 });
    }

    const requestedKitchenData = requestedKitchen.data() as Kitchen;

    return NextResponse.json(requestedKitchenData);
  } catch (error) {
    console.log(`KITCHEN_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
