import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useDeleteApiProfileRequestIdImagesImageId } from "@/api/generated/hooks";
import { API_BASE_URL } from "@/lib/axios";
import { Button } from "@/components/ui/button";

interface Props {
  requestId: string;
  images: { id: number; contentType: string }[];
  onChanged: () => void;
}

// How long to wait for one photo before giving up on it and moving on to the next, so a
// single stuck request can't block the rest of the gallery from ever starting to load.
const LOAD_TIMEOUT_MS = 10_000;

export const ProfileImageGrid = ({ requestId, images, onChanged }: Props) => {
  const deleteMutation = useDeleteApiProfileRequestIdImagesImageId({
    mutation: { onSuccess: onChanged },
  });

  // Load photos one at a time in the order they appear instead of firing every request at
  // once — on a bandwidth-constrained connection, having them all compete for the same
  // upload bandwidth makes every one of them crawl, instead of the first few appearing
  // quickly while the rest queue up behind them.
  const [readyIndex, setReadyIndex] = useState(0);
  const advancePast = (index: number) =>
    setReadyIndex((current) => Math.max(current, index + 1));

  if (images.length === 0) {
    return <p className="text-sm font-light opacity-80">No photos yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-screen-sm">
      {images.map((image, index) => (
        <div key={image.id} className="relative aspect-square">
          <BookcaseImage
            src={`${API_BASE_URL}/api/profile/${requestId}/images/${image.id}`}
            active={index <= readyIndex}
            onSettled={() => advancePast(index)}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            aria-label="Remove image"
            className="absolute top-1 right-1 h-6 w-6"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate({ requestId, imageId: image.id })}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

/**
 * The grid slot is already a fixed aspect-square box, so nothing shifts as photos load — but
 * an image popping in abruptly (or the browser's broken-image glyph flashing while it's still
 * loading) still reads as a "jump". A pulsing skeleton keeps the slot visibly "loading" the
 * whole time, then fades into the real photo once it arrives.
 *
 * `active` gates whether the request fires at all — nothing renders (so no request fires)
 * until the grid activates it, which happens once the previous photo finishes loading, errors,
 * or times out, so photos load in order rather than all competing for bandwidth at once.
 */
const BookcaseImage = ({
  src,
  active,
  onSettled,
}: {
  src: string;
  active: boolean;
  onSettled: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const settledRef = useRef(false);

  const settle = () => {
    if (settledRef.current) return;
    settledRef.current = true;
    onSettled();
  };

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  useEffect(() => {
    if (!active || settledRef.current) return;
    const timeout = setTimeout(settle, LOAD_TIMEOUT_MS);
    return () => clearTimeout(timeout);
    // Only re-arm when this image becomes active — `settle` itself is stable in effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <>
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-md bg-muted animate-pulse"
        />
      )}
      {active && (
        <img
          ref={imgRef}
          src={src}
          alt="Bookcase"
          decoding="async"
          onLoad={() => {
            setLoaded(true);
            settle();
          }}
          onError={settle}
          className={`absolute inset-0 w-full h-full object-cover rounded-md transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </>
  );
};
