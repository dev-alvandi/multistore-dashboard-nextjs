import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Billboard, Store } from "../../../../../type-db";
import { db } from "../../../../../lib/firebase";

interface BodyProps {
  label: string;
  imageUrl: string;
}

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
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

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const { label, imageUrl } = body;

    if (!label) {
      return new NextResponse("Billboard name is missing", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Billboard image is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const billboardRef = await getDoc(
      doc(db, "stores", params.storeId, "billboards", params.billboardId)
    );

    if (!billboardRef.exists()) {
      return new NextResponse("Billboard does not exist", { status: 400 });
    }

    await updateDoc(
      doc(db, "stores", params.storeId, "billboards", params.billboardId),
      { ...billboardRef.data, label, imageUrl, updatedAt: serverTimestamp() }
    );

    const updatedBillboard = (
      await getDoc(
        doc(db, "stores", params.storeId, "billboards", params.billboardId)
      )
    ).data() as Billboard;

    return NextResponse.json(updatedBillboard);
  } catch (error) {
    console.log(`BILLBOARD_POST: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const billboardRef = doc(
      db,
      "stores",
      params.storeId,
      "billboards",
      params.billboardId
    );

    if (!billboardRef) {
      return new NextResponse("Billboard does not exist", { status: 400 });
    }

    await deleteDoc(billboardRef);

    return NextResponse.json({ msg: "Billboard deleted" });
  } catch (error) {
    console.log(`BILLBOARD_DELETE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

// GET a single category
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const requestedBillboard = await getDoc(
      doc(db, "stores", params.storeId, "billboards", params.billboardId)
    );

    if (!requestedBillboard.exists()) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    const requestedBillboardData = requestedBillboard.data() as Billboard;

    return NextResponse.json(requestedBillboardData);
  } catch (error) {
    console.log(`BILLBOARD_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
