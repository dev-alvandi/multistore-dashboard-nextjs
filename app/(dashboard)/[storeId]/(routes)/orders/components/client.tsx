"use client";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { OrderColumns, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/api-list";

interface OrdersClientProps {
  data: OrderColumns[];
}

const OrdersClient = ({ data }: OrdersClientProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data.length})`}
          description="Manage orders for your store"
        />
      </div>

      <Separator />
      <DataTable searchKey={"name"} columns={columns} data={data} />
    </Fragment>
  );
};

export default OrdersClient;
