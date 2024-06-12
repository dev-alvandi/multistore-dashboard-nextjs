import { db } from "@/lib/firebase";
import { Billboard } from "@/type-db";
import { doc, getDoc } from "firebase/firestore";
import BillboardForm from "./components/billboard-form";

const BillboardPage = async ({
  params,
}: {
  params: { storeId: string; billboardId: string };
}) => {
  const billboard = (
    await getDoc(
      doc(db, "stores", params.storeId, "billboards", params.billboardId)
    )
  ).data() as Billboard;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
