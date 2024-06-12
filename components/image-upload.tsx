"use client";

import { storage } from "@/lib/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ImagePlay, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PuffLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUploadImage = async (e: any) => {
    setIsLoading(true);

    const file = e.target.files[0];

    const storageRef = ref(storage, `Images/${Date.now()}-${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        toast.error("Error during uploading the file");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setIsLoading(false);
          toast.success("Image Uploaded");
          onChange(downloadURL);
        });
      }
    );
  };

  const onDeleteImage = (url: any) => {
    onRemove(url);
    deleteObject(ref(storage, url)).then(() => {
      toast.success("Image deleted");
    });
  };

  return (
    <div>
      {value && value.length > 0 ? (
        <>
          <div className="mb-4 flex items-center gap-4">
            {value.map((url) => (
              <div
                className="relative w-52 h-52 rounded-md overflow-hidden"
                key={url}
              >
                <Image
                  src={url}
                  alt="Billboard Image"
                  className="object-contain"
                  fill
                />
                <div className="absolute z-10 top-2 right-2">
                  <Button
                    disabled={isLoading}
                    type="button"
                    variant={"destructive"}
                    size={"icon"}
                    onClick={() => onDeleteImage(url)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200 flex flex-col justify-center items-center gap-3">
          {isLoading ? (
            <>
              <PuffLoader size={30} color="#555" />
              <p>{progress.toFixed(2)}%</p>
            </>
          ) : (
            <>
              <label className="w-full h-full flex justify-center items-center">
                <div className="w-full h-full flex flex-col justify-center items-center gap-2 cursor-pointer">
                  <ImagePlay className="h-4 w-4" />
                  <p>Upload an image</p>
                </div>
                <input
                  type="file"
                  name="imageUrl"
                  accept="image/*"
                  onChange={onUploadImage}
                  className="w-0 h-0"
                />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
