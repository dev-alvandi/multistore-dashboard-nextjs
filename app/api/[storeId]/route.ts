import { db, storage } from "@/lib/firebase";
import { Store } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { deleteObject, ref } from "firebase/storage";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();

    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const { name } = body;

    if (!name) {
      return new NextResponse("Name is missing!", { status: 400 });
    }

    const docRef = doc(db, "stores", params.storeId);
    await updateDoc(docRef, { name });

    const store = (await getDoc(docRef)).data() as Store;

    return NextResponse.json({ msg: "Store updated" });
  } catch (error) {
    console.log(`STORE_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const docRef = doc(db, "stores", params.storeId);

    // TODO: Delete all sub-collections and along with those data file urls

    // billboards
    const billboardsQuerySnapshots = await getDocs(
      collection(db, `stores/${params.storeId}/billboards`)
    );

    billboardsQuerySnapshots.forEach(async (billboardDoc) => {
      await deleteDoc(billboardDoc.ref);

      // Remove images from the storage
      const imageUrl = billboardDoc.data().imageUrl;
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
    });

    // categories
    const categoriesQuerySnapshots = await getDocs(
      collection(db, `stores/${params.storeId}/categories`)
    );

    categoriesQuerySnapshots.forEach(async (categoryDoc) => {
      await deleteDoc(categoryDoc.ref);
    });

    // sizes
    const sizesQuerySnapshots = await getDocs(
      collection(db, `stores/${params.storeId}/sizes`)
    );

    sizesQuerySnapshots.forEach(async (sizeDoc) => {
      await deleteDoc(sizeDoc.ref);
    });

    // kitchens
    const kitchensQuerySnapshots = await getDocs(
      collection(db, `stores/${params.storeId}/kitchens`)
    );

    kitchensQuerySnapshots.forEach(async (kitchenDoc) => {
      await deleteDoc(kitchenDoc.ref);
    });

    // cuisines
    const cuisinesQuerySnapshots = await getDocs(
      collection(db, `stores/${params.storeId}/cuisines`)
    );

    cuisinesQuerySnapshots.forEach(async (cuisineDoc) => {
      await deleteDoc(cuisineDoc.ref);
    });

    // products
    const productsQuerySnapshots = await getDocs(
      collection(db, `stores/${params.storeId}/products`)
    );

    productsQuerySnapshots.forEach(async (productDoc) => {
      await deleteDoc(productDoc.ref);

      const imagesArray = productDoc.data().images;
      if (imagesArray && Array.isArray(imagesArray)) {
        await Promise.all(
          imagesArray.map(async (image) => {
            const imageRef = ref(storage, image.url);
            await deleteObject(imageRef);
          })
        );
      }
    });

    // orders
    const ordersQuerySnapshots = await getDocs(
      collection(db, `stores/${params.storeId}/orders`)
    );

    ordersQuerySnapshots.forEach(async (orderDoc) => {
      await deleteDoc(orderDoc.ref);

      const ordersItemArray = orderDoc.data().orderItems;
      if (ordersItemArray && Array.isArray(ordersItemArray)) {
        await Promise.all(
          ordersItemArray.map(async (orderItem) => {
            const itemImagesArray = orderItem.images;
            if (itemImagesArray && Array.isArray(itemImagesArray)) {
              await Promise.all(
                itemImagesArray.map(async (image) => {
                  const imageRef = ref(storage, image.url);
                  await deleteObject(imageRef);
                })
              );
            }
          })
        );
      }
    });

    // finally deleting the store
    await deleteDoc(docRef);

    return NextResponse.json({
      msg: "Store and all of its sub-collections deleted",
    });
  } catch (error) {
    console.log(`STORE_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
