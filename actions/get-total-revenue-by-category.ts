import { db } from "@/lib/firebase";
import { Category, Order } from "@/type-db";
import { collection, doc, getDocs } from "firebase/firestore";

interface GraphData {
  name: string;
  total: number;
}

export const getTotalRevenueByCategory = async (storeId: string) => {
  const ordersData = (
    await getDocs(collection(doc(db, "stores", storeId), "orders"))
  ).docs.map((doc) => doc.data()) as Order[];

  const categories = (
    await getDocs(collection(doc(db, "stores", storeId), "categories"))
  ).docs.map((doc) => doc.data()) as Category[];

  const categoryRevenue: {
    [key: string]: number;
  } = {};

  for (const order of ordersData) {
    for (const item of order.orderItems) {
      const category = item.category;

      if (category) {
        let revenueForOrder = 0;

        for (const item of order.orderItems) {
          revenueForOrder += item.price * (item.qty ?? 1);
        }

        categoryRevenue[category] =
          (categoryRevenue[category] || 0) + revenueForOrder;
      }
    }
  }

  const graphData: GraphData[] = categories.map((category) => ({
    name: category.name,
    total: categoryRevenue[category.name] || 0,
  }));

  return graphData;
};
