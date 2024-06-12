import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Category } from "@/type-db";
import { CategoryColumns } from "./components/columns";
import { format } from "date-fns";
import CategoryClient from "./components/client";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categoriesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
  ).docs.map((doc) => doc.data()) as Category[];

  const formattedCategoriesData: CategoryColumns[] = categoriesData.map(
    (item) => ({
      id: item.id,
      billboardLabel: item.billboardLabel,
      name: item.name,
      createdAt: item.createdAt
        ? format(item.createdAt.toDate(), "MMMM do, yyyy")
        : "",
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategoriesData} />
      </div>
    </div>
  );
};

export default CategoriesPage;
