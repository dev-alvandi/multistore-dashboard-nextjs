import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Size } from "@/type-db";
import { SizeColumns } from "./components/columns";
import { format } from "date-fns";
import SizesClient from "./components/client";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "sizes"))
  ).docs.map((doc) => doc.data()) as Size[];

  const formattedSizesData: SizeColumns[] = sizesData.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizesData} />
      </div>
    </div>
  );
};

export default SizesPage;
