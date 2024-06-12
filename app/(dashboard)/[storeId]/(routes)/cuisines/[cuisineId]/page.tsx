import { db } from "@/lib/firebase";
import { Size } from "@/type-db";
import { doc, getDoc } from "firebase/firestore";
import CuisineForm from "./components/cuisine-form";

const BillboardPage = async ({
  params,
}: {
  params: { storeId: string; cuisineId: string };
}) => {
  const cuisine = (
    await getDoc(
      doc(db, "stores", params.storeId, "cuisines", params.cuisineId)
    )
  ).data() as Size;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CuisineForm initialData={cuisine} />
      </div>
    </div>
  );
};

export default BillboardPage;
