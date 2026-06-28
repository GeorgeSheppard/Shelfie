import { ImagePlus } from "lucide-react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { ACCEPTED_IMAGE_FORMATS, RecommendationFormSchema } from "./validator";
import { Progress } from "../ui/progress";
import { useEffect, useState } from "react";

interface Props {
  formControl: Control<RecommendationFormSchema>;
  submit: () => void;
  isSubmitting: boolean;
}

const LoadingState = ({ value }: { value: File[] }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(30), 500);
    const timer2 = setTimeout(() => setProgress(66), 1600);
    const timer3 = setTimeout(() => setProgress(95), 2400);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Progress value={progress} />
      <p className="font-extralight">
        Uploading{" "}
        {(
          value.reduce((prev, cur) => prev + cur.size, 0) /
          (1024 * 1024)
        ).toFixed(1)}
        MB
      </p>
    </div>
  );
};

export const FileUploader = ({ formControl, submit, isSubmitting }: Props) => {
  return (
    <FormField
      control={formControl}
      name="images"
      render={({ field: { onChange, value, ...rest } }) => (
        <FormItem>
          <FormControl>
            <label htmlFor="form">
              <input
                id="form"
                className="hidden"
                type="file"
                placeholder="image"
                accept={ACCEPTED_IMAGE_FORMATS.join(",")}
                {...rest}
                onClick={(event) => {
                  (event.target as HTMLInputElement).value = "";
                }}
                onChange={(event) => {
                  const files = event.target.files;
                  if (!files || files.length === 0) return;

                  onChange(Array.from(files));
                  submit();
                }}
                multiple
              />
              {isSubmitting ? (
                <LoadingState value={value} />
              ) : (
                <div
                  className="flex flex-col gap-6 cursor-pointer"
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const file = event.dataTransfer.files?.[0];
                    if (!file) return;

                    onChange(file);
                    submit();
                  }}
                >
                  <ImagePlus className="w-24 h-24 m-auto" />
                  <FormDescription>
                    Choose an image or drag it here
                  </FormDescription>
                </div>
              )}
              <FormMessage />
            </label>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
