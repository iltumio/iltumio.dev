import { QwikIntrinsicElements } from "@builder.io/qwik";

export const Vue = ({
  width,
  height,
  ...props
}: QwikIntrinsicElements["svg"]) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    stroke-width={0}
    viewBox="0 0 448 512"
    height={height || 25}
    width={width || 25}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M356.9 64.3H280l-56 88.6-48-88.6H0L224 448 448 64.3h-91.1zm-301.2 32h53.8L224 294.5 338.4 96.3h53.8L224 384.5 55.7 96.3z"
      fill="#1A202C"
      stroke="none"
    />
  </svg>
);
