"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { CategoryColumns, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/api-list";

interface CategoryClientProps {
  data: CategoryColumns[];
}

const CategoryClient = ({ data }: CategoryClientProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/create`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <Separator />
      <DataTable searchKey={"name"} columns={columns} data={data} />

      <Heading title="API" description="API calls for categories" />
      <Separator />
      <ApiList entityName="categories" entityId="categoryId" />
    </Fragment>
  );
};

export default CategoryClient;
