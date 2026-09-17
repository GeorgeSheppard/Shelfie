import { useGetApiProfileRequestId } from "@/api/generated/hooks";
import { AddImagesButton } from "@/components/AddImagesButton/AddImagesButton";
import { HomeLoading } from "@/components/HomeLoading";
import { PreferencesForm } from "@/components/PreferencesForm/PreferencesForm";
import { ProfileImageGrid } from "@/components/ProfileImageGrid/ProfileImageGrid";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { requestId } = useParams();

  const profileQuery = useGetApiProfileRequestId(requestId!, {
    query: { enabled: !!requestId },
  });

  if (!requestId || profileQuery.isError)
    return (
      <div className="flex items-center text-center flex-col gap-8">
        <p>We can't find your profile, want to go home?</p>
        <Button
          onClick={() => navigate("/")}
          className="max-w-[50%] m-auto"
          aria-label="Home"
        >
          Home
        </Button>
      </div>
    );

  if (profileQuery.isLoading || !profileQuery.data)
    return (
      <div className="flex flex-col gap-8 items-center text-center">
        <HomeLoading />
      </div>
    );

  return (
    <div className="flex flex-col gap-8 items-center text-center">
      <Button
        variant="link"
        size="sm"
        aria-label="Back to recommendations"
        onClick={() => navigate(-1)}
      >
        ← Back to recommendations
      </Button>
      <div className="flex flex-col gap-4 items-center w-full">
        <h2 className="text-lg font-medium">Tailor your recommendations</h2>
        <p className="max-w-md text-balance font-light opacity-80 text-sm">
          Anything specific you'd like more (or less) of in your
          recommendations?
        </p>
        <PreferencesForm
          requestId={requestId}
          initialValue={profileQuery.data.customPreferences}
          onSaved={(recommendationId) =>
            navigate(`/recommendations/${recommendationId}?new=true`)
          }
        />
      </div>
      <div className="flex flex-col gap-4 items-center w-full">
        <h2 className="text-lg font-medium">Your bookcase photos</h2>
        <ProfileImageGrid
          requestId={requestId}
          images={profileQuery.data.images}
          onChanged={() => profileQuery.refetch()}
        />
        <AddImagesButton
          requestId={requestId}
          onAdded={(recommendationId) =>
            navigate(`/recommendations/${recommendationId}?new=true`)
          }
        />
      </div>
    </div>
  );
}
