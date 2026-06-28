import { Recommendation } from "@/api/generated/hooks";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

interface Props {
  book: Recommendation;
}

export const RecommendationListItem = ({ book }: Props) => {
  return (
    <Card className="text-start w-full">
      <CardHeader className="flex flex-row items-center flex-wrap justify-between gap-4">
        <div>
          <CardTitle>{book.name}</CardTitle>
          <CardDescription>{book.author}</CardDescription>
        </div>
        <Button asChild aria-label={`Buy ${book.name}`}>
          <a href={book.amazonLink} target="_blank" className="!my-0">
            Buy this book!
          </a>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm">{book.description}</p>
        <Separator />
        <p className="text-sm">
          <strong>Why: </strong>
          {book.reason}
        </p>
      </CardContent>
    </Card>
  );
};
