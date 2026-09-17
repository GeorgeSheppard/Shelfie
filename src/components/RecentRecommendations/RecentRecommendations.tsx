import { useGetApiProfileRequestIdRecommendations } from "@/api/generated/hooks";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Props {
  requestId: string;
}

// Pinned to a fixed locale rather than the visitor's own, so the format is stable and testable
// regardless of whose browser is rendering it.
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const RecentRecommendations = ({ requestId }: Props) => {
  const navigate = useNavigate();
  const query = useGetApiProfileRequestIdRecommendations(requestId, {
    query: { enabled: !!requestId },
  });

  const recommendations = query.data?.recommendations ?? [];
  if (recommendations.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <h2 className="text-lg font-medium">Recent recommendations</h2>
      <ul className="flex flex-col gap-1">
        {recommendations.map((recommendation) => (
          <li key={recommendation.id}>
            <Button
              variant="link"
              size="sm"
              aria-label={`View recommendations from ${formatDate(recommendation.createdUtc)}`}
              onClick={() => navigate(`/recommendations/${recommendation.id}`)}
            >
              {formatDate(recommendation.createdUtc)}
              {!recommendation.processedUtc && " (still processing)"}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
