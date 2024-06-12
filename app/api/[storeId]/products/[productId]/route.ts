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
import { Product, Store } from "@/type-db";
import { db, storage } from "@/lib/firebase";
import { deleteObject, ref } from "firebase/storage";

interface BodyProps {
  name: string;
  price: string;
  images: { url: string }[];
  isFeatured: boolean;
  isArchived: boolean;
  category: string;
  size: string;
  kitchen: string;
  cuisine: string;
}

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
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

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const {
      name,
      price,
      images,
      isFeatured,
      isArchived,
      category,
      size,
      kitchen,
      cuisine,
    } = body;

    if (!name) {
      return new NextResponse("Product name is missing", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!category) {
      return new NextResponse("Category is missing", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Product price is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    console.log(images);

    const productRef = await getDoc(
      doc(db, "stores", params.storeId, "products", params.productId)
    );

    if (!productRef.exists()) {
      return new NextResponse("Product does not exist", { status: 400 });
    }

    await updateDoc(
      doc(db, "stores", params.storeId, "products", params.productId),
      {
        ...productRef.data,
        name,
        price,
        images,
        isFeatured,
        isArchived,
        category,
        size: size || "",
        kitchen: kitchen || "",
        cuisine: cuisine || "",
        updatedAt: serverTimestamp(),
      }
    );

    const updatedProduct = (
      await getDoc(
        doc(db, "stores", params.storeId, "products", params.productId)
      )
    ).data() as Product;

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.log(`PRODUCT_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const productRef = doc(
      db,
      "stores",
      params.storeId,
      "products",
      params.productId
    );

    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return new NextResponse("Product does not exist", { status: 400 });
    }

    // Delete all the corresponding images
    const images = productDoc.data().images;

    if (images && Array.isArray(images)) {
      await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, image.url);
          await deleteObject(imageRef);
        })
      );
    }

    await deleteDoc(productRef);

    return NextResponse.json({
      msg: "Product and all the corresponding images deleted",
    });
  } catch (error) {
    console.log(`PRODUCT_DELETE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

// GET a single category
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const requestedProduct = await getDoc(
      doc(db, "stores", params.storeId, "products", params.productId)
    );

    if (!requestedProduct.exists()) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const requestedProductData = requestedProduct.data() as Product;

    console.log(requestedProductData);

    return NextResponse.json(requestedProductData);
  } catch (error) {
    console.log(`PRODUCT_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
