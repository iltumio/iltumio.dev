import { component$ } from "@builder.io/qwik";
import type { DocumentHead, DocumentMeta } from "@builder.io/qwik-city";

export default component$(() => {
  return <div></div>;
});

const description: DocumentMeta = {
  name: "description",
  content: "Web3 and blockchain engineer from Milan",
};

export const head: DocumentHead = {
  title: "Manuel Tumiati | Blockchain Engineer",
  meta: [description],
};
