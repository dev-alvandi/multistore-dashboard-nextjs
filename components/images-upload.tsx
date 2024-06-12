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

interface ImagesUploadProps {
  disabled: boolean;
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImagesUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImagesUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);

    const files: File[] = Array.from(e.target.files || []);

    const newUrls: string[] = [];

    let completedUploads = 0;

    files.forEach((file: File) => {
      const storageRef = ref(
        storage,
        `Images/Products/${Date.now()}-${file.name}`
      );

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
            newUrls.push(downloadURL);
            completedUploads++;
            if (completedUploads === files.length) {
              setIsLoading(false);

              onChange([...value, ...newUrls]);

              toast.success("Images Uploaded");
            }
          });
        }
      );
    });
  };

  const onDeleteImage = async (url: string) => {
    const newValue = value.filter((imageUrl) => imageUrl !== url);
    onRemove(url);
    onChange(newValue);
    await deleteObject(ref(storage, url));
    toast.success("Image deleted");
  };

  return (
    <div className="flex flex-col justify-between items-start gap-4">
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
                <p>Upload images</p>
              </div>
              <input
                type="file"
                name="imageUrl"
                accept="image/*"
                onChange={onUploadImage}
                className="w-0 h-0"
                multiple
              />
            </label>
          </>
        )}
      </div>

      {value && value.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-4">
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
      )}
    </div>
  );
};

export default ImagesUpload;
