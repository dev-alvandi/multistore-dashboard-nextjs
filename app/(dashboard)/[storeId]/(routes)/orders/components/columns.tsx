"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CellActions from "./cell-actions";
import CellImage from "./cell-image";
import { cn } from "@/lib/utils";

export type OrderColumns = {
  id: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  phone: string;
  images: string[];
  address: string;
  orderStatus: string;
  createdAt: string;
};

const statusStyles: any = {
  processing: "text-[#F97300]",
  delivering: "text-[#FFD369]",
  delivered: "text-[#4E9F3D]",
  canceled: "text-[#CD1818]",
};

export const columns: ColumnDef<OrderColumns>[] = [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const { images } = row.original;
      return (
        <div className="grid grid-cols-2 gap-2">
          <CellImage data={images} />
        </div>
      );
    },
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Amount",
  },
  {
    accessorKey: "isPaid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { isPaid } = row.original;

      return (
        <p
          className={cn(
            "text-lg font-semibold",
            isPaid ? "text-emerald-500" : "text-red-500"
          )}
        >
          {isPaid ? "Paid" : "Not Paid"}
        </p>
      );
    },
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const { orderStatus }: { orderStatus: string } = row.original;
      return (
        <p
          className={cn(
            "text-base font-semibold",
            statusStyles[orderStatus.toLowerCase()]
          )}
        >
          {orderStatus}
        </p>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
