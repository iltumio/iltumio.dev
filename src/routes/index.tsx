import { component$ } from "@builder.io/qwik";
import type { DocumentHead, DocumentMeta } from "@builder.io/qwik-city";
import CurrentJobs from "~/components/currentJobs/currentJobs";
import Skills from "~/components/skills/skills";
import Header from "../components/header/header";
import Cta from "~/components/cta/cta";

export default component$(() => {
  return (
    <>
      <main class="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div class="w-full max-w-5xl px-6 lg:px-8 py-8 lg:py-16 space-y-16 lg:space-y-24">
          <Header />
          
          <div class="space-y-16 lg:space-y-24">
            <section class="animate-fade-in-up" style="animation-delay: 0.1s">
              <CurrentJobs />
            </section>
            
            <section class="animate-fade-in-up" style="animation-delay: 0.2s">
              <Skills />
            </section>

            <section class="animate-fade-in-up" style="animation-delay: 0.3s">
              <Cta />
            </section>
          </div>
        </div>
      </main>
      <footer class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Manuel Tumiati. All rights reserved.
      </footer>
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
