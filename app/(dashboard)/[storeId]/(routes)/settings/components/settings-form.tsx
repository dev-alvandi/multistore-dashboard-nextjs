"use client";

import ApiAlert from "@/components/api-alert";
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
import { useOrigin } from "@/hooks/use-origin";
import { Store } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface SettingsFormProps {
  initialData: Store;
}

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const formSchema = z.object({
    name: z
      .string()
      .min(3, { message: "The name should contain at least 3 characters." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const origin = useOrigin();
  const params = useParams();
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/${params.storeId}`, data);
      toast.success("Store updated");
      router.refresh();
    } catch (error) {
      toast.error("Error during updating the store's name!");
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${params.storeId}`);
      toast.success("Store deleted");
      router.push("/");
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
        <Heading title="Settings" description="Manage Store Preferences" />
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
                      placeholder="Your store name ..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type="submit" size={"sm"}>
            Save Changes
          </Button>
        </form>
      </Form>

      <Separator />

      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </Fragment>
  );
};

export default SettingsForm;
