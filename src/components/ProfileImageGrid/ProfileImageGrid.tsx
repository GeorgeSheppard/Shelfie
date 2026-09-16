import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useDeleteApiProfileRequestIdImagesImageId } from "@/api/generated/hooks";
import { API_BASE_URL } from "@/lib/axios";
import { Button } from "@/components/ui/button";

interface Props {
  requestId: string;
  images: { id: number; contentType: string }[];
  onChanged: () => void;
}

export const ProfileImageGrid = ({ requestId, images, onChanged }: Props) => {
  const deleteMutation = useDeleteApiProfileRequestIdImagesImageId({
    mutation: { onSuccess: onChanged },
  });

  if (images.length === 0) {
    return <p className="text-sm font-light opacity-80">No photos yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-screen-sm">
      {images.map((image) => (
        <div key={image.id} className="relative aspect-square">
          <BookcaseImage
            src={`${API_BASE_URL}/api/profile/${requestId}/images/${image.id}?thumbnail=true`}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            aria-label="Remove image"
            className="absolute top-1 right-1 h-6 w-6"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate({ requestId, imageId: image.id })}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

/**
 * The grid slot is already a fixed aspect-square box, so nothing shifts as photos load —
 * but each one popping in abruptly at a different time still reads as a "jump". Fading it
 * in over a muted placeholder smooths that out instead.
 */
const BookcaseImage = ({ src }: { src: string }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <img
      ref={imgRef}
      src={src}
      alt="Bookcase"
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={`w-full h-full object-cover rounded-md bg-muted transition-opacity duration-300 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};
