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
          <img
            src={`${API_BASE_URL}/api/profile/${requestId}/images/${image.id}`}
            alt="Bookcase"
            className="w-full h-full object-cover rounded-md"
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
