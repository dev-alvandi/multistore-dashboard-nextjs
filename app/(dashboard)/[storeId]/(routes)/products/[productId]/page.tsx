import { db } from "@/lib/firebase";
import { Category, Cuisine, Kitchen, Product, Size } from "@/type-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import ProductForm from "./components/product-form";

const BillboardPage = async ({
  params,
}: {
  params: { storeId: string; productId: string };
}) => {
  const product = (
    await getDoc(
      doc(db, "stores", params.storeId, "products", params.productId)
    )
  ).data() as Product;

  const categories = (
    await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
  ).docs.map((doc) => doc.data()) as Category[];

  const sizes = (
    await getDocs(collection(doc(db, "stores", params.storeId), "sizes"))
  ).docs.map((doc) => doc.data()) as Size[];

  const kitchens = (
    await getDocs(collection(doc(db, "stores", params.storeId), "kitchens"))
  ).docs.map((doc) => doc.data()) as Kitchen[];

  const cuisines = (
    await getDocs(collection(doc(db, "stores", params.storeId), "cuisines"))
  ).docs.map((doc) => doc.data()) as Cuisine[];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
          kitchens={kitchens}
          cuisines={cuisines}
        />
      </div>
    </div>
  );
};

export default BillboardPage;
