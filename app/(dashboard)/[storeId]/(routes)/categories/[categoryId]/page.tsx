import { db } from "@/lib/firebase";
import { Billboard, Category } from "@/type-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import CategoryForm from "./components/category-form";

const BillboardPage = async ({
  params,
}: {
  params: { storeId: string; categoryId: string };
}) => {
  const category = (
    await getDoc(
      doc(db, "stores", params.storeId, "categories", params.categoryId)
    )
  ).data() as Category;

  const billboardsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "billboards"))
  ).docs.map((doc) => doc.data()) as Billboard[];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboardsData} />
      </div>
    </div>
  );
};

export default BillboardPage;
