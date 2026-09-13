import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { AXIOS_INSTANCE } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ACCEPTED_IMAGE_FORMATS } from "@/components/RecommendationForm/validator";

interface Props {
  requestId: string;
  onAdded: (recommendationId: string) => void;
}

export const AddImagesButton = ({ requestId, onAdded }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Custom mutation for multiple file upload, matching the from-bookcase upload on Home.
  const mutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("bookcase", file));

      const { data } = await AXIOS_INSTANCE.post<{
        imagesAdded: number;
        recommendationId: string;
        success: true;
      }>(`/api/profile/${requestId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        signal: AbortSignal.timeout(120000),
      });
      return data;
    },
    onSuccess: (data) => onAdded(data.recommendationId),
  });

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        accept={[...ACCEPTED_IMAGE_FORMATS, ".heic", ".heif"].join(",")}
        onChange={(event) => {
          const files = event.target.files;
          // Copy files out to a plain array before clearing the input — resetting
          // `value` can empty out the live FileList `files` still refers to.
          const fileArray = files ? Array.from(files) : [];
          event.target.value = "";
          if (fileArray.length === 0) return;
          mutation.mutate(fileArray);
        }}
      />
      <Button
        type="button"
        variant="outline"
        aria-label="Add more photos"
        disabled={mutation.isPending}
        onClick={() => inputRef.current?.click()}
      >
        {mutation.isPending ? "Uploading..." : "Add more photos"}
      </Button>
      {mutation.isError && (
        <p className="text-sm text-destructive">
          Something went wrong uploading your photos, please try again.
        </p>
      )}
    </>
  );
};
