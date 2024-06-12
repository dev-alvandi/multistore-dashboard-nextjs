"use client";

import Heading from "@/components/heading";
import AlertModal from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Kitchen } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface KitchenFormProps {
  initialData: Kitchen;
}

const KitchenForm = ({ initialData }: KitchenFormProps) => {
  const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Kitchen" : "Create Kitchen";
  const description = initialData ? "Edit a kitchen" : "Create a new Kitchen";
  const toastSuccessMessage = initialData
    ? "Kitchen Updated"
    : "Kitchen Created";
  const toastErrorMessage = initialData
    ? "An error occured during updating the kitchen"
    : "An error occured during creating the kitchen";
  const action = initialData ? "Save Changes" : "Create Kitchen";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (!initialData) {
        await axios.post(`/api/${params.storeId}/kitchens`, data);
      } else {
        await axios.patch(
          `/api/${params.storeId}/kitchens/${params.kitchenId}`,
          data
        );
      }
      toast.success(toastSuccessMessage);
      router.push(`/${params.storeId}/kitchens`);
    } catch (error) {
      toast.error(toastErrorMessage);
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  const onConfirmDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/${params.storeId}/kitchens/${params.kitchenId}`);
      toast.success("Kitchen deleted");
      router.push(`/${params.storeId}/kitchens`);
      router.refresh();
    } catch (error) {
      toast.error("Error during deleting the kitchen!");
    } finally {
      setIsLoading(false);
      setOpenAlertModal(false);
    }
  };

  return (
    <Fragment>
      <AlertModal
        isOpen={openAlertModal}
        onClose={() => {
          setOpenAlertModal(false);
        }}
        onConfirm={onConfirmDelete}
        loading={isLoading}
      />
      <div className="flex items-center justify-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => {
              setOpenAlertModal(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your kitchen name ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your kitchen value ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type="submit" size={"sm"}>
            {action}
          </Button>
        </form>
      </Form>
    </Fragment>
  );
};

export default KitchenForm;
