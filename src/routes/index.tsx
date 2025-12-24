import { component$ } from "@builder.io/qwik";
import type { DocumentHead, DocumentMeta } from "@builder.io/qwik-city";
import CurrentJobs from "~/components/currentJobs/currentJobs";
import Skills from "~/components/skills/skills";
import Header from "../components/header/header";
import Cta from "~/components/cta/cta";

export default component$(() => {
  return (
    <>
      <main class="min-h-screen flex flex-col justify-center items-center">
        <div class="p-2 lg:p-0 lg:max-w-6xl flex flex-col">
          <Header />
          <section>
            <CurrentJobs />
          </section>
          <section>
            <Cta />
          </section>
          <section>
            <Skills />
          </section>
        </div>
      </main>
      <footer></footer>
    </>
  );
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
