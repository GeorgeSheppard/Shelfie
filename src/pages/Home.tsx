import { DisplayError } from "@/components/DisplayError";
import { FileUploader } from "@/components/RecommendationForm/FileUploader";
import {
  recommendationFormSchema,
  RecommendationFormSchema,
} from "@/components/RecommendationForm/validator";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { AXIOS_INSTANCE } from "@/lib/axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  // Custom mutation for multiple file upload since generated hook only supports single file
  const mutation = useMutation({
    mutationFn: async (values: RecommendationFormSchema) => {
      const formData = new FormData();
      values.images.forEach((file) => formData.append("bookcase", file));

      const { data } = await AXIOS_INSTANCE.post<{ id: string; success: true }>(
        "/api/recommendations/from-bookcase",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          signal: AbortSignal.timeout(30000),
        }
      );
      return data;
    },
    onSuccess: (data) => {
      navigate(`/recommendations/${data.id}?new=true`);
    },
  });

  const form = useForm<RecommendationFormSchema>({
    resolver: zodResolver(recommendationFormSchema),
    mode: "onChange",
  });
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (values: RecommendationFormSchema) => {
    mutation.mutate(values);
  };

  return (
    <div className="flex flex-col gap-8 items-center text-center">
      <p className="max-w-screen-sm font-light text-balance">
        Upload pictures of your bookshelf or bookcase, and we will craft you
        some recommendations for your next best reads.
      </p>
      {mutation.isError && <DisplayError error={mutation.error} />}
      <div className="flex justify-between flex-wrap items-center flex-col sm:flex-row w-full max-w-screen-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
            <Card className="flex flex-col justify-center p-6 w-[256px] h-[256px] hover:drop-shadow-card !cursor-pointer">
              <FileUploader
                formControl={form.control}
                submit={() =>
                  formRef.current?.dispatchEvent(
                    new Event("submit", {
                      cancelable: true,
                      bubbles: true,
                    })
                  )
                }
                isSubmitting={mutation.isPending}
              />
            </Card>
          </form>
        </Form>
        <div className="hidden sm:block w-[1px] bg-border rounded-lg h-[100%] py-[30%]" />
        <Card className="hidden sm:flex flex-col justify-between p-6 w-[256px] h-[256px] items-center gap-4">
          <QRCode
            value={
              process.env.NODE_ENV === "development"
                ? "http://192.168.1.118:5173/"
                : window.location.origin
            }
            size={180}
            className="m-auto"
            bgColor={"hsl(var(--card))"}
            fgColor={"hsl(var(--card-foreground))"}
          />
          <p className="text-[0.8rem] text-muted-foreground">
            Upload from mobile
          </p>
        </Card>
      </div>
    </div>
  );
};
