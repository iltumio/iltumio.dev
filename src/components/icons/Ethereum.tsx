import { QwikIntrinsicElements } from "@builder.io/qwik";

export const Ethereum = (props: QwikIntrinsicElements["svg"]) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    viewBox="0 0 320 512"
    height={25}
    width={25}
    xmlns="http://www.w3.org/2000/svg"
    stroke-width={0}
    {...props}
  >
    <path
      d="M311.9 260.8 160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4 8 290.6 160 512l152-221.4-152 92.8z"
      fill="#1A202C"
      stroke="none"
    />
  </svg>
);
