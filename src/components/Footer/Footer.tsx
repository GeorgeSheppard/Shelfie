import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="flex flex-col gap-2 pb-4 text-center">
      <div className="flex flex-row justify-center gap-4">
        <Link to="/support" className="font-light underline text-sm">
          Contact us
        </Link>
        <Link
          to="https://form.jotform.com/250055251174347"
          className="font-light underline text-sm"
          target="_blank"
        >
          Give us feedback
        </Link>
        <Link to="/privacy" className="font-light underline text-sm">
          Privacy policy
        </Link>
      </div>
      <p className="font-extralight text-xs">{`© ${new Date().getFullYear()} shelfie.georgesheppard.dev. All rights reserved.`}</p>
    </footer>
  );
};
