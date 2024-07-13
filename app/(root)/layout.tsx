import { db } from "@/lib/firebase";
import { Store } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";

interface SetupLayoutProps {
  children: React.ReactNode;
}

const SetupLayout = async ({ children }: SetupLayoutProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const storeSnap = await getDocs(
    query(collection(db, "stores"), where("userId", "==", userId))
  );

  let store: any = [];

  storeSnap.forEach((doc) => {
    store = doc.data() as Store;
    return;
  });

  if (store && store.id) {
    redirect(`/${store.id}`);
  }

  return <div>{children}</div>;
};

export default SetupLayout;
