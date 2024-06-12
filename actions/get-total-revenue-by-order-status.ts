import { db } from "@/lib/firebase";
import { Order } from "@/type-db";
import { collection, doc, getDocs } from "firebase/firestore";

interface GraphData {
  name: string;
  total: number;
}

export const getTotalRevenueByOrderStatus = async (storeId: string) => {
  const ordersData = (
    await getDocs(collection(doc(db, "stores", storeId), "orders"))
  ).docs.map((doc) => doc.data()) as Order[];

  const orderStatusRevenue: {
    [key: string]: number;
  } = {};

  for (const order of ordersData) {
    const orderStatus = order.orderStatus;

    if (orderStatus) {
      let revenueForOrder = 0;

      for (const item of order.orderItems) {
        revenueForOrder += item.price * (item.qty ?? 1);
      }

      orderStatusRevenue[orderStatus] =
        (orderStatusRevenue[orderStatus] || 0) + revenueForOrder;
    }
  }

  const orderStatusMap: { [key: string]: number } = {
    Processing: 0,
    Delivering: 1,
    Delivered: 2,
    Canceled: 3,
  };

  const graphData: GraphData[] = Object.keys(orderStatusMap).map(
    (orderStatusName) => ({
      name: orderStatusName,
      total: orderStatusRevenue[orderStatusName] || 0,
    })
  );

  return graphData;
};
