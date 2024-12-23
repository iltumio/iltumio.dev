import { component$ } from "@builder.io/qwik";
import type { DocumentHead, DocumentMeta } from "@builder.io/qwik-city";

export default component$(() => {
  return <div></div>;
});

const description: DocumentMeta = {
  name: "description",
  content:
    "Redefining digital identity with seamless, innovative solutions for everyone at Zyphe Inc",
};

export const head: DocumentHead = {
  title: "Manuel Tumiati | Web3 CTO & Blockchain Engineer",
  meta: [description],
};
