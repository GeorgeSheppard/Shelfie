import { GetApiRecommendationsId200 } from "@/api/generated/hooks";
import { useNavigate } from "react-router-dom";
import { RecommendationListItem } from "../RecommendationListItem/RecommendationListItem";
import { Button } from "../ui/button";

export const RecommendationsList = ({
  books,
}: {
  books: GetApiRecommendationsId200;
}) => {
  const navigate = useNavigate();

  return (
    <>
      {books.recommendations?.map((book) => (
        <RecommendationListItem key={book.name} book={book} />
      ))}
      {(books.recommendations?.length ?? 0) === 0 && (
        <>
          <p>Hmm, no recommendations, want to try again?</p>
          <Button
            onClick={() => navigate("/")}
            className="max-w-[50%] m-auto"
            aria-label="Home"
          >
            Home
          </Button>
        </>
      )}
    </>
  );
};
