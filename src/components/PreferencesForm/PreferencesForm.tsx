import { useEffect, useState } from "react";
import {
  usePostApiProfileRequestIdPreferences,
  getGetApiProfileRequestIdQueryKey,
  PostApiProfileRequestIdPreferences400,
} from "@/api/generated/hooks";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  requestId: string;
  initialValue: string | null;
  onSaved: (recommendationId: string) => void;
}

const MAX_LENGTH = 2000;

export const PreferencesForm = ({ requestId, initialValue, onSaved }: Props) => {
  const [value, setValue] = useState(initialValue ?? "");

  // Re-sync when the fetched value changes — e.g. React Query showing a stale cached
  // profile first (from a previous visit) before its background refetch resolves.
  useEffect(() => {
    setValue(initialValue ?? "");
  }, [initialValue]);

  const queryClient = useQueryClient();
  const mutation = usePostApiProfileRequestIdPreferences({
    mutation: {
      onSuccess: (data) => {
        // Otherwise navigating back to this page can show the pre-save cached value
        // before the background refetch catches up.
        queryClient.invalidateQueries({
          queryKey: getGetApiProfileRequestIdQueryKey(requestId),
        });
        onSaved(data.recommendationId);
      },
    },
  });

  const errorMessage = isAxiosError<PostApiProfileRequestIdPreferences400>(
    mutation.error
  )
    ? mutation.error.response?.data.error
    : undefined;

  return (
    <div className="flex flex-col gap-2 w-full max-w-screen-sm items-center">
      <Textarea
        value={value}
        maxLength={MAX_LENGTH}
        placeholder="e.g. I'd love more sci-fi, and please avoid horror."
        onChange={(event) => setValue(event.target.value)}
        className="bg-card"
      />
      <Button
        type="button"
        aria-label="Save preferences"
        disabled={mutation.isPending}
        onClick={() =>
          mutation.mutate({ requestId, data: { customPreferences: value } })
        }
      >
        {mutation.isPending ? "Saving..." : "Save"}
      </Button>
      {mutation.isError && (
        <p className="text-sm text-destructive max-w-xs">
          {errorMessage ?? "Something went wrong, please try again."}
        </p>
      )}
    </div>
  );
};
