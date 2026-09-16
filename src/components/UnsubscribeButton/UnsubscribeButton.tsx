import { useState } from "react";
import { usePostApiRecommendationsDeleteEmail } from "@/api/generated/hooks";
import { Button } from "@/components/ui/button";

export const UnsubscribeButton = ({
  requestId,
  onUnsubscribed,
}: {
  requestId: string;
  onUnsubscribed: () => void;
}) => {
  const [confirming, setConfirming] = useState(false);

  const mutation = usePostApiRecommendationsDeleteEmail({
    mutation: {
      onSuccess: () => {
        setConfirming(false);
        onUnsubscribed();
      },
    },
  });

  if (mutation.isSuccess) {
    return (
      <p className="text-sm font-light opacity-80">
        You've been unsubscribed and won't receive any more emails.
      </p>
    );
  }

  if (confirming) {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-light opacity-80">
          Are you sure you want to unsubscribe from recommendation emails?
        </p>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            aria-label="Confirm unsubscribe"
            onClick={() => mutation.mutate({ data: { requestId } })}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "..." : "Yes, unsubscribe"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-label="Cancel unsubscribe"
            onClick={() => setConfirming(false)}
          >
            Cancel
          </Button>
        </div>
        {mutation.isError && (
          <p className="text-sm text-destructive">
            Something went wrong, please try again.
          </p>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="link"
      size="sm"
      aria-label="Unsubscribe"
      onClick={() => setConfirming(true)}
    >
      Unsubscribe from emails
    </Button>
  );
};
