import { useState } from "react";
import { usePostApiProfileRequestIdPreferences } from "@/api/generated/hooks";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  requestId: string;
  initialValue: string | null;
}

const MAX_LENGTH = 2000;

export const PreferencesForm = ({ requestId, initialValue }: Props) => {
  const [value, setValue] = useState(initialValue ?? "");

  const mutation = usePostApiProfileRequestIdPreferences();

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
      {mutation.isSuccess && (
        <p className="text-sm font-light opacity-80">Saved!</p>
      )}
      {mutation.isError && (
        <p className="text-sm text-destructive">
          Something went wrong, please try again.
        </p>
      )}
    </div>
  );
};
