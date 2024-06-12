"use client";

import { useParams, useRouter } from "next/navigation";
import { OrderColumns } from "./columns";
import { Fragment, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreVertical, Trash } from "lucide-react";
import toast from "react-hot-toast";
import AlertModal from "@/components/modal/alert-modal";
import axios from "axios";

interface CellActionsProps {
  data: OrderColumns;
}

const CellActions = ({ data }: CellActionsProps) => {
  const params = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("Order id is copied to clipboard");
  };

  const onUpdate = async (orderStatus: string) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, {
        orderStatus,
      });
      router.push(`/${params.storeId}/orders`);
      router.refresh();
      //   location.reload(); // Hard reload
      toast.success("Order updated");
    } catch (error) {
      toast.error("Error during updating the order!");
    } finally {
      setIsLoading(false);
      setOpenModal(false);
    }
  };

  const onConfirmDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${params.storeId}/orders/${data.id}`);
      router.push(`/${params.storeId}/orders`);
      router.refresh();
      //   location.reload(); // Hard reload
      toast.success("Order deleted");
    } catch (error) {
      toast.error("Error during deleting the order!");
    } finally {
      setIsLoading(false);
      setOpenModal(false);
    }
  };

  return (
    <Fragment>
      <AlertModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        onConfirm={onConfirmDelete}
        loading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant={"ghost"}>
            <span className="sr-only">Open</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onUpdate.bind(null, "Processing")}>
            <Edit className="h-4 w-4 mr-2" />
            Processing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onUpdate.bind(null, "Delivering")}>
            <Edit className="h-4 w-4 mr-2" />
            Delivering
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onUpdate.bind(null, "Delivered")}>
            <Edit className="h-4 w-4 mr-2" />
            Delivered
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onUpdate.bind(null, "Canceled")}>
            <Edit className="h-4 w-4 mr-2" />
            Cancel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenModal(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
};

export default CellActions;
