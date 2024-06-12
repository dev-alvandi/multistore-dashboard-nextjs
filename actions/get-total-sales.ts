import { db } from "@/lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";

export const getTotalSales = async (storeId: string) => {
  const ordersData = await getDocs(
    collection(doc(db, "stores", storeId), "orders")
  );

  const totalSales = ordersData.size;

  return totalSales;
};

export default getTotalSales;
