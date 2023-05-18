import { QwikIntrinsicElements } from "@builder.io/qwik";

export const Solana = ({
  width,
  height,
  ...props
}: QwikIntrinsicElements["svg"]) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 250 195.56"
    xmlSpace="preserve"
    width={width || 25}
    height={height || 25}
    {...props}
  >
    <path
      d="M204.04 48.77H3.86c-3.43 0-5.15-4.05-2.74-6.44L42.95 1.11C43.67.4 44.66 0 45.69 0h200.18c3.43 0 5.15 4.05 2.74 6.44l-41.82 41.21c-.74.71-1.72 1.12-2.75 1.12zM45.96 146.79h200.18c3.43 0 5.15 4.05 2.74 6.44l-41.82 41.21c-.72.71-1.71 1.11-2.74 1.11H4.14c-3.43 0-5.15-4.05-2.74-6.44l41.82-41.21c.73-.71 1.71-1.11 2.74-1.11zm0-25.24h200.18c3.43 0 5.15-4.05 2.74-6.44L207.05 73.9a3.907 3.907 0 0 0-2.74-1.11H4.14c-3.43 0-5.15 4.05-2.74 6.44l41.82 41.21c.73.71 1.71 1.11 2.74 1.11z"
      fill="#020203"
      style={{
        fill: "#020203",
      }}
    />
  </svg>
);
