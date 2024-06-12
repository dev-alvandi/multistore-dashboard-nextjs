import { db } from "@/lib/firebase";
import { Order } from "@/type-db";
import { collection, doc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const ordersData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "orders"))
    ).docs.map((doc) => doc.data()) as Order[];

    return NextResponse.json(ordersData);
  } catch (error) {
    console.log(`ORDERS_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
