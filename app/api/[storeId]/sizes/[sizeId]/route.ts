import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Size, Store } from "@/type-db";
import { db } from "@/lib/firebase";

interface BodyProps {
  name: string;
  value: string;
}

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
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

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const { name, value } = body;

    if (!name) {
      return new NextResponse("Size name is missing", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Size value is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const sizeRef = await getDoc(
      doc(db, "stores", params.storeId, "sizes", params.sizeId)
    );

    if (!sizeRef.exists()) {
      return new NextResponse("Size does not exist", { status: 400 });
    }

    await updateDoc(doc(db, "stores", params.storeId, "sizes", params.sizeId), {
      ...sizeRef.data,
      name,
      value,
      updatedAt: serverTimestamp(),
    });

    const updatedSize = (
      await getDoc(doc(db, "stores", params.storeId, "sizes", params.sizeId))
    ).data() as Size;

    return NextResponse.json(updatedSize);
  } catch (error) {
    console.log(`SIZE_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const sizeRef = doc(db, "stores", params.storeId, "sizes", params.sizeId);

    if (!sizeRef) {
      return new NextResponse("Size does not exist", { status: 400 });
    }

    await deleteDoc(sizeRef);

    return NextResponse.json({ msg: "Size deleted" });
  } catch (error) {
    console.log(`SIZE_DELETE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

// GET a single category
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.sizeId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const requestedSize = await getDoc(
      doc(db, "stores", params.storeId, "sizes", params.sizeId)
    );

    if (!requestedSize.exists()) {
      return new NextResponse("Size not found", { status: 404 });
    }

    const requestedSizeData = requestedSize.data() as Size;

    return NextResponse.json(requestedSize);
  } catch (error) {
    console.log(`SIZE_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
