import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { Product } from "@/type-db";
import { Item } from "@radix-ui/react-dropdown-menu";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
  return NextResponse.json({}, { headers: corsHeaders });
};

interface PostRequestProps {
  products: Product[];
  userId: string;
}

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  const { products, userId }: PostRequestProps = await req.json();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((prod: Product) => {
    line_items.push({
      quantity: prod.qty,
      price_data: {
        currency: "SEK",
        product_data: {
          name: prod.name,
        },
        unit_amount: Math.round(prod.price * 100),
      },
    });
  });

  // Add the doc to the firestore

  const orderData = {
    isPaid: false,
    orderItems: products,
    userId,
    orderStatus: "Processing",
    createdAt: serverTimestamp(),
  };

  const orderRef = await addDoc(
    collection(db, "stores", params.storeId, "orders"),
    orderData
  );

  const id = orderRef.id;

  await updateDoc(doc(db, "stores", params.storeId, "orders", id), {
    ...orderData,
    id,
    updatedAt: serverTimestamp(),
  });

  const session = await await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["SE", "NO", "FI", "DE", "US", "CA", "GB", "AU"],
    },
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: id,
      storeId: params.storeId,
    },
  });

  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
};
