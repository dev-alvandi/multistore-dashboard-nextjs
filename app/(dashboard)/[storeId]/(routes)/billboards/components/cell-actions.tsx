"use client";

import { useParams, useRouter } from "next/navigation";
import { BillboardColums } from "./columns";
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
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface CellActionsProps {
  data: BillboardColums;
}

const CellActions = ({ data }: CellActionsProps) => {
  const params = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("Billboard id is copied to clipboard");
  };

  const onUpdate = () => {
    router.push(`/${params.storeId}/billboards/${data.id}`);
  };

  const onConfirmDelete = async () => {
    try {
      setIsLoading(true);
      await deleteObject(ref(storage, data.imageUrl));
      await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
      router.push(`/${params.storeId}/billboards`);
      router.refresh();
      //   location.reload(); // Hard reload
      toast.success("Billboard deleted");
    } catch (error) {
      toast.error("Error during deleting the store!");
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
          <DropdownMenuItem onClick={onUpdate}>
            <Edit className="h-4 w-4 mr-2" />
            Update
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
