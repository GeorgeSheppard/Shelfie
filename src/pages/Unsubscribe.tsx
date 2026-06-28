import { usePostApiRecommendationsDeleteEmail } from "@/api/generated/hooks";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Unsubscribe() {
  const navigate = useNavigate();
  const { requestId } = useParams();

  const unsubscribeMutation = usePostApiRecommendationsDeleteEmail();

  useEffect(() => {
    if (!requestId) return;

    unsubscribeMutation.mutate({ data: { requestId } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!requestId || unsubscribeMutation.isError)
    return (
      <div className="flex items-center text-center flex-col gap-8">
        <p>Something went wrong, please try again or contact support</p>
        <Button
          onClick={() => navigate("/support")}
          className="max-w-[50%] m-auto"
          aria-label="Support"
        >
          Support
        </Button>
      </div>
    );

  if (unsubscribeMutation.isPending)
    return (
      <div className="flex flex-col gap-8 items-center text-center">
        <p>Unsubscribing...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 items-center">
      <p>You are now unsubscribed</p>
    </div>
  );
}
