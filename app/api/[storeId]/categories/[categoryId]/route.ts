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
import { Category, Store } from "@/type-db";
import { db } from "@/lib/firebase";

interface BodyProps {
  name: string;
  billboardLabel: string;
  billboardId: string;
}

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
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

    if (!params.categoryId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const { name, billboardLabel, billboardId } = body;

    if (!name) {
      return new NextResponse("Category name is missing", { status: 400 });
    }

    if (!billboardLabel) {
      return new NextResponse("Billboard label is missing", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard id is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const categoryRef = await getDoc(
      doc(db, "stores", params.storeId, "categories", params.categoryId)
    );

    if (!categoryRef.exists()) {
      return new NextResponse("Category does not exist", { status: 400 });
    }

    await updateDoc(
      doc(db, "stores", params.storeId, "categories", params.categoryId),
      {
        ...categoryRef.data,
        name,
        billboardLabel,
        billboardId,
        updatedAt: serverTimestamp(),
      }
    );

    const updatedCategory = (
      await getDoc(
        doc(db, "stores", params.storeId, "categories", params.categoryId)
      )
    ).data() as Category;

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.log(`BILLBOARD_POST: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const categoryRef = doc(
      db,
      "stores",
      params.storeId,
      "categories",
      params.categoryId
    );

    if (!categoryRef) {
      return new NextResponse("Category does not exist", { status: 400 });
    }

    await deleteDoc(categoryRef);

    return NextResponse.json({ msg: "Category deleted" });
  } catch (error) {
    console.log(`CATEGORY_DELETE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

// GET a single category
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const requestedCategory = await getDoc(
      doc(db, "stores", params.storeId, "categories", params.categoryId)
    );

    if (!requestedCategory.exists()) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const requestedCategoryData = requestedCategory.data() as Category;

    return NextResponse.json(requestedCategoryData);
  } catch (error) {
    console.log(`CATEGORY_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
