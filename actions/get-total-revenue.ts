import { db } from "@/lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { Order } from "@/type-db";

export const getTotalRevenue = async (storeId: string) => {
  const ordersData = (
    await getDocs(collection(doc(db, "stores", storeId), "orders"))
  ).docs.map((doc) => doc.data()) as Order[];

  const paidOrders = ordersData.filter((order) => order.isPaid);

  const totalRevenue = paidOrders.reduce((total, paidOrder) => {
    const orderTotal = paidOrder.orderItems.reduce((orderSum, item) => {
      return orderSum + item.price * (item.qty ?? 1);
    }, 0);

    return total + orderTotal;
  }, 0);

  return totalRevenue;
};

export default getTotalRevenue;
