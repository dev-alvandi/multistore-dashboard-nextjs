import { db } from "@/lib/firebase";
import { Size } from "@/type-db";
import { doc, getDoc } from "firebase/firestore";
import SizeForm from "./components/size-form";

const BillboardPage = async ({
  params,
}: {
  params: { storeId: string; sizeId: string };
}) => {
  const size = (
    await getDoc(doc(db, "stores", params.storeId, "sizes", params.sizeId))
  ).data() as Size;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default BillboardPage;
