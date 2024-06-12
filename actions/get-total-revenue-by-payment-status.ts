import { db } from "@/lib/firebase";
import { Order } from "@/type-db";
import { collection, doc, getDocs } from "firebase/firestore";

interface GraphData {
  name: string;
  total: number;
}

export const getTotalRevenueByPaymentStatus = async (storeId: string) => {
  const ordersData = (
    await getDocs(collection(doc(db, "stores", storeId), "orders"))
  ).docs.map((doc) => doc.data()) as Order[];

  const paymentStatusRevenue: {
    [key: string]: number;
  } = {};

  for (const order of ordersData) {
    const paymentStatus = order.isPaid ? "Paid" : "Not Paid";

    if (paymentStatus) {
      let revenueForOrder = 0;

      for (const item of order.orderItems) {
        revenueForOrder += item.price * (item.qty ?? 1);
      }

      paymentStatusRevenue[paymentStatus] =
        (paymentStatusRevenue[paymentStatus] || 0) + revenueForOrder;
    }
  }

  const paymentStatusMap: { [key: string]: number } = {
    Paid: 0,
    "Not Paid": 1,
  };

  const graphData: GraphData[] = Object.keys(paymentStatusMap).map(
    (paymentStatusName) => ({
      name: paymentStatusName,
      total: paymentStatusRevenue[paymentStatusName] || 0,
    })
  );

  return graphData;
};
