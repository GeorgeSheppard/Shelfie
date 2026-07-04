import { AxiosError } from "axios";

export const DisplayError = ({ error }: { error: unknown }) => {
  let text = "Oops, something went wrong there. Please try again.";

  if (error instanceof AxiosError) {
    const errorMessage = error.response?.data?.error;

    if (errorMessage) {
      // Map common error messages to user-friendly text
      if (errorMessage.includes("empty")) {
        text = "It appears the image you provided is empty.";
      } else if (errorMessage.includes("file type") || errorMessage.includes("format")) {
        text = "Hmm, we were expecting a different file type there...";
      } else if (errorMessage.includes("too large") || errorMessage.includes("size")) {
        text = "Whoops, your file is too large! Uploaded file must be less than 20MB.";
      } else if (errorMessage.includes("no file") || errorMessage.includes("missing")) {
        text = "Hmm, we were expecting an image, please try again.";
      } else if (errorMessage.includes("generation") || errorMessage.includes("extract")) {
        text = "We received your image but are struggling to generate your recommendations. Please try again and make sure your image is in focus.";
      } else {
        text = errorMessage;
      }
    }
  }

  return <p className="text-destructive font-light">{text}</p>;
};
