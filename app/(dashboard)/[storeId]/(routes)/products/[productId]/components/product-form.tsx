"use client";

import Heading from "@/components/heading";
import ImagesUpload from "@/components/images-upload";
import AlertModal from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Category, Cuisine, Kitchen, Product, Size } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ProductFormProps {
  initialData: Product;
  categories: Category[];
  sizes: Size[];
  kitchens: Kitchen[];
  cuisines: Cuisine[];
}

const ProductForm = ({
  initialData,
  categories,
  sizes,
  kitchens,
  cuisines,
}: ProductFormProps) => {
  const formSchema = z.object({
    name: z.string().min(1),
    price: z.coerce.number().min(1),
    images: z.object({ url: z.string() }).array(),
    isFeatured: z.boolean().default(false),
    isArchived: z.boolean().default(false),
    category: z.string().min(1),
    size: z.string().optional(),
    kitchen: z.string().optional(),
    cuisine: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      price: 0,
      images: [],
      isFeatured: false,
      isArchived: false,
      category: "",
      size: "",
      kitchen: "",
      cuisine: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData ? "Edit a product" : "Create a new Product";
  const toastSuccessMessage = initialData
    ? "Product Updated"
    : "Product Created";
  const toastErrorMessage = initialData
    ? "An error occured during updating the product"
    : "An error occured during creating the product";
  const action = initialData ? "Save Changes" : "Create Product";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (!initialData) {
        await axios.post(`/api/${params.storeId}/products`, data);
      } else {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      }
      toast.success(toastSuccessMessage);
      router.push(`/${params.storeId}/products`);
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

      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      toast.success("Product deleted");
      router.push(`/${params.storeId}/products`);
      router.refresh();
    } catch (error) {
      toast.error("Error during deleting the store!");
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
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billboard Image</FormLabel>
                <FormControl>
                  <ImagesUpload
                    value={field.value.map((image) => image.url)}
                    disabled={isLoading}
                    onChange={(urls) =>
                      field.onChange(urls.map((url) => ({ url })))
                    }
                    onRemove={(url) =>
                      field.onChange(
                        field.value.filter((currUrl) => currUrl.url !== url)
                      )
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />

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
                      placeholder="Product name ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      placeholder="Product price ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select a category"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select a size"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizes.map((size) => (
                          <SelectItem key={size.id} value={size.name}>
                            {size.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kitchen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kitchen</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select a kitchen"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {kitchens.map((kitchen) => (
                          <SelectItem key={kitchen.id} value={kitchen.name}>
                            {kitchen.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cuisine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select a cuisine"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cuisines.map((cuisine) => (
                          <SelectItem key={cuisine.id} value={cuisine.name}>
                            {cuisine.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home screen
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store
                    </FormDescription>
                  </div>
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

export default ProductForm;
