"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { CuisineColumns, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/api-list";

interface CuisinesClientProps {
  data: CuisineColumns[];
}

const CuisinesClient = ({ data }: CuisinesClientProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <Heading
          title={`Cuisines (${data.length})`}
          description="Manage cuisines for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/cuisines/create`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <Separator />
      <DataTable searchKey={"name"} columns={columns} data={data} />

      <Heading title="API" description="API calls for cuisines" />
      <Separator />
      <ApiList entityName="cuisines" entityId="cuisineId" />
    </Fragment>
  );
};

export default CuisinesClient;
