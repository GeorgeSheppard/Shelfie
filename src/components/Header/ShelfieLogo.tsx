import { useNavigate } from "react-router-dom";

export const ShelfieLogo = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/")}
      className="flex justify-center w-[108px] h-[40px] cursor-pointer"
    >
      <svg
        id="ec4Sjeak2r01"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 180 60"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
      >
        <text
          dx="0"
          dy="0"
          fontFamily='"Geist"'
          fontSize="50"
          fontWeight="400"
          transform="translate(16.637902 45.165802)"
          strokeWidth="0"
          className="fill-current text-primary"
        >
          <tspan y="0" fontWeight="400" strokeWidth="0">
            Shelfie
          </tspan>
        </text>
        <rect
          width="180"
          height="8.50623"
          rx="0"
          ry="0"
          transform="translate(0 51.49377)"
          strokeWidth="0"
          className="fill-current text-primary"
        />
        <rect
          width="180"
          height="8.50623"
          rx="0"
          ry="0"
          transform="matrix(0 0.34-1 0 8.50623-1.2)"
          strokeWidth="0"
          className="fill-current text-primary"
        />
      </svg>
    </div>
  );
};
