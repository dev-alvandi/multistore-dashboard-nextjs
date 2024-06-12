import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/type-db";
import { ProductColumns } from "./components/columns";
import { format } from "date-fns";
import ProductsClient from "./components/client";
import { priceFormatter } from "@/lib/utils";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const productsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "products"))
  ).docs.map((doc) => doc.data()) as Product[];

  const formattedProductsData: ProductColumns[] = productsData.map((item) => ({
    id: item.id,
    name: item.name,
    price: priceFormatter.format(item.price),
    images: item.images,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    category: item.category,
    size: item.size,
    kitchen: item.kitchen,
    cuisine: item.cuisine,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProductsData} />
      </div>
    </div>
  );
};

export default ProductsPage;
