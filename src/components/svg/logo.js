import React from "react";

const LogoSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="80px"
      height="80px"
    >
      {/* Background */}
      <rect
        x="0"
        y="0"
        width="256"
        height="256"
        rx="48"
        fill="#0F172A"
      />

      {/* V Logo */}
      <path
        d="M72 64 L128 192 L184 64"
        fill="none"
        stroke="#DCDCDD"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LogoSvg;
