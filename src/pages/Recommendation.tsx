import { usePostApiRecommendationsAddEmail } from "@/api/generated/hooks";
import { EmailFormField } from "@/components/FrequencyForm/EmailFormField";
import { RecurringFormField } from "@/components/FrequencyForm/RecurringFormField";
import {
  frequencyFormSchema,
  FrequencyFormSchema,
} from "@/components/FrequencyForm/validator";
import { HomeLoading } from "@/components/HomeLoading";
import { RecommendationsList } from "@/components/RecommendationsList/RecommendationsList";
import { Button } from "@/components/ui/button";
import { useRecommendations } from "@/lib/hooks/useRecommendations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function Recommendation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const newUser = !!searchParams.get("new");
  const booksQuery = useRecommendations(id);

  const form = useForm<FrequencyFormSchema>({
    resolver: zodResolver(frequencyFormSchema),
    mode: "onChange",
    defaultValues: {
      recurringMonthly: true,
    },
  });

  const mutation = usePostApiRecommendationsAddEmail({
    mutation: {
      onSuccess: async () => {
        await booksQuery.refetch();
        form.reset();
      },
    },
  });

  if (!id)
    return (
      <div className="flex items-center text-center flex-col gap-8">
        <p>We can't find your recommendations, want to create some?</p>
        <Button
          onClick={() => navigate("/")}
          className="max-w-[50%] m-auto"
          aria-label="Home"
        >
          Home
        </Button>
      </div>
    );

  if (booksQuery.isError)
    return (
      <div className="flex items-center text-center flex-col gap-8">
        <p className="max-w-md">{booksQuery.error.error || "An error occurred"}</p>
        <Button
          onClick={() => navigate("/")}
          className="max-w-[50%] m-auto"
          aria-label="Home"
        >
          Home
        </Button>
      </div>
    );

  const onSubmit = (values: FrequencyFormSchema) => {
    mutation.mutate({
      data: {
        id,
        recurring: `${values.recurringMonthly}`,
        email: values.email,
      },
    });
  };

  if (booksQuery.isLoading || booksQuery.data?.recommendations === null)
    return (
      <div className="flex flex-col gap-8 items-center text-center">
        <HomeLoading />
        {newUser && !booksQuery.data?.hasEmail && (
          <>
            <p className="max-w-md text-balance font-light opacity-80 dot break-words">
              Thanks for using Shelfie. You can keep this page open to wait, or
              add your email and we will email you when it's done.
            </p>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4 max-w-xs">
                  <EmailFormField />
                  <RecurringFormField />
                  <Button type="submit" aria-label="Submit">
                    {mutation.isPending ? "..." : "Submit"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </>
        )}
        {newUser && !!booksQuery.data?.hasEmail && (
          <p className="max-w-md text-balance font-light opacity-80 dot break-words">
            Feel free to close this page, we will email you when it's done.
          </p>
        )}
      </div>
    );

  const missingInformation =
    !booksQuery.data?.hasEmail || !booksQuery.data?.isRecurringMonthly;
  const hasRecommendations = (booksQuery.data?.recommendations.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-4 items-center text-center">
      {missingInformation && hasRecommendations && (
        <>
          <p className="max-w-md text-balance font-light opacity-80 dot break-words">
            If you would like more recommendations like this, then we can send
            you some every month!
          </p>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4 max-w-xs">
                {!booksQuery.data?.hasEmail && <EmailFormField />}
                <RecurringFormField />
                <Button type="submit" aria-label="Submit">
                  {mutation.isPending ? "..." : "Submit"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </>
      )}
      {booksQuery.data && <RecommendationsList books={booksQuery.data} />}
    </div>
  );
}
