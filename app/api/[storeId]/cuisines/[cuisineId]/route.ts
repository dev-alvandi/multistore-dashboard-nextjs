import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Cuisine, Store } from "@/type-db";
import { db } from "@/lib/firebase";

interface BodyProps {
  name: string;
  value: string;
}

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; cuisineId: string } }
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

    if (!params.cuisineId) {
      return new NextResponse("Cuisine id is required", { status: 400 });
    }

    const { name, value } = body;

    if (!name) {
      return new NextResponse("Cuisine name is missing", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Cuisine value is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const cuisineRef = await getDoc(
      doc(db, "stores", params.storeId, "cuisines", params.cuisineId)
    );

    if (!cuisineRef.exists()) {
      return new NextResponse("Cuisine does not exist", { status: 400 });
    }

    await updateDoc(
      doc(db, "stores", params.storeId, "cuisines", params.cuisineId),
      {
        ...cuisineRef.data,
        name,
        value,
        updatedAt: serverTimestamp(),
      }
    );

    const updatedCuisine = (
      await getDoc(
        doc(db, "stores", params.storeId, "cuisines", params.cuisineId)
      )
    ).data() as Cuisine;

    return NextResponse.json(updatedCuisine);
  } catch (error) {
    console.log(`CUISINE_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; cuisineId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.cuisineId) {
      return new NextResponse("Cuisine id is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const cuisineRef = doc(
      db,
      "stores",
      params.storeId,
      "cuisines",
      params.cuisineId
    );

    if (!cuisineRef) {
      return new NextResponse("Cuisine does not exist", { status: 400 });
    }

    await deleteDoc(cuisineRef);

    return NextResponse.json({ msg: "Cuisine deleted" });
  } catch (error) {
    console.log(`CUISINE_DELETE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

// GET a single category
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string; cuisineId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.cuisineId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const requestedCuisine = await getDoc(
      doc(db, "stores", params.storeId, "cuisines", params.cuisineId)
    );

    if (!requestedCuisine.exists()) {
      return new NextResponse("Cuisine not found", { status: 404 });
    }

    const requestedCuisineData = requestedCuisine.data() as Cuisine;

    return NextResponse.json(requestedCuisineData);
  } catch (error) {
    console.log(`CUISINE_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
