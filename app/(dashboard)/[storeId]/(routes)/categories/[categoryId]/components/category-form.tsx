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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Billboard, Category } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CategoryFormProps {
  initialData: Category;
  billboards: Billboard[];
}

const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const params = useParams();
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData ? "Edit a category" : "Create a new Category";
  const toastSuccessMessage = initialData
    ? "Category Updated"
    : "Category Created";
  const toastErrorMessage = initialData
    ? "An error occured during updating the category"
    : "An error occured during creating the category";
  const action = initialData ? "Save Changes" : "Create Category";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const { billboardId: formBillboardId } = form.getValues();
      const matchingBillboard = billboards.find(
        (billboard) => billboard.id === formBillboardId
      );

      if (!initialData) {
        await axios.post(`/api/${params.storeId}/categories`, {
          ...data,
          billboardLabel: matchingBillboard?.label,
        });
      } else {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          {
            ...data,
            billboardLabel: matchingBillboard?.label,
          }
        );
      }
      toast.success(toastSuccessMessage);
      router.push(`/${params.storeId}/categories`);
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
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      toast.success("Category deleted");
      router.push(`/${params.storeId}/categories`);
      router.refresh();
    } catch (error) {
      toast.error("Error during deleting the category!");
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
                      placeholder="Your category name ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="">
                          <SelectValue
                            placeholder="Select a billboard"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.map((billboard) => (
                          <SelectItem key={billboard.id} value={billboard.id}>
                            {billboard.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

export default CategoryForm;
