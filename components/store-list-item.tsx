"use client";

import { cn } from "@/lib/utils";
import { Check, Store } from "lucide-react";
import React from "react";

interface StoreListItemProps {
  store: any;
  onSelect: (store: any) => void;
  isChecked: boolean;
}

const StoreListItem = ({ store, isChecked, onSelect }: StoreListItemProps) => {
  return (
    <div
      className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-50 hover:bg-gray-800 text-muted-foreground hover:text-primary dark:hover:text-gray-100"
      onClick={() => onSelect(store)}
    >
      <Store className="mr-2 h-4 w-4" />
      <p className="w-full truncate text-sm whitespace-nowrap">{store.label}</p>
      <Check
        className={cn(
          "ml-auto w-4 h-4",
          isChecked ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};

export default StoreListItem;
