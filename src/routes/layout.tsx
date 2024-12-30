import { component$ } from "@builder.io/qwik";
import CurrentJobs from "~/components/currentJobs/currentJobs";
import Skills from "~/components/skills/skills";
import Header from "../components/header/header";
import Cta from "~/components/cta/cta";

export default component$(() => {
  return (
    <>
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
    </>
  );
});
