import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Kitchen } from "@/type-db";
import { KitchenColumns } from "./components/columns";
import { format } from "date-fns";
import KitchensClient from "./components/client";

const KitchensPage = async ({ params }: { params: { storeId: string } }) => {
  const kitchensData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "kitchens"))
  ).docs.map((doc) => doc.data()) as Kitchen[];

  const formattedKitchensData: KitchenColumns[] = kitchensData.map((item) => ({
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
        <KitchensClient data={formattedKitchensData} />
      </div>
    </div>
  );
};

export default KitchensPage;
