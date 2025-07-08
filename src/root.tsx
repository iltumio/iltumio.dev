import { component$ } from "@builder.io/qwik";
import CurrentJobs from "~/components/currentJobs/currentJobs";
import Skills from "~/components/skills/skills";
import Header from "./components/header/header";
import Cta from "~/components/cta/cta";

import "./global.css";

export default component$(() => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Manuel Tumiati | Web3 CTO & Blockchain Engineer</title>
        <meta name="description" content="Redefining digital identity with seamless, innovative solutions for everyone at Zyphe Inc" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body lang="en">
        <main class="bg-gray-50 min-h-screen flex flex-col justify-center items-center">
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
      </body>
    </html>
  );
});
