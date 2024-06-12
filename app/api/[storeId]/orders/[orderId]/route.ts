import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Order, Store } from "@/type-db";
import { db } from "@/lib/firebase";

interface BodyProps {
  orderStatus: string;
}

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
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

    if (!params.orderId) {
      return new NextResponse("Order id is required", { status: 400 });
    }

    const { orderStatus } = body;

    if (!orderStatus) {
      return new NextResponse("Order status is missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const orderRef = await getDoc(
      doc(db, "stores", params.storeId, "orders", params.orderId)
    );

    if (!orderRef.exists()) {
      return new NextResponse("Order does not exist", { status: 400 });
    }

    await updateDoc(
      doc(db, "stores", params.storeId, "orders", params.orderId),
      {
        ...orderRef.data,
        orderStatus,
        updatedAt: serverTimestamp(),
      }
    );

    const updatedOrder = (
      await getDoc(doc(db, "stores", params.storeId, "orders", params.orderId))
    ).data() as Order;

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.log(`ORDER_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.orderId) {
      return new NextResponse("Order id is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const orderRef = doc(
      db,
      "stores",
      params.storeId,
      "orders",
      params.orderId
    );

    if (!orderRef) {
      return new NextResponse("Order does not exist", { status: 400 });
    }

    await deleteDoc(orderRef);

    return NextResponse.json({ msg: "Order deleted" });
  } catch (error) {
    console.log(`ORDER_DELETE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

// GET a single category
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 500 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!params.orderId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data() as Store;
      if (storeData.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const requestedOrder = await getDoc(
      doc(db, "stores", params.storeId, "orders", params.orderId)
    );

    if (!requestedOrder.exists()) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const requestedOrderData = requestedOrder.data() as Order;

    return NextResponse.json(requestedOrder);
  } catch (error) {
    console.log(`ORDER_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
