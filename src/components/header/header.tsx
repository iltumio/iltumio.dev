import { component$ } from "@builder.io/qwik";
import ProfilePicture from "../../images/ProfilePicture.png";
import Social from "../social/social";

export default component$(() => {
  return (
    <header>
      <section class="flex justify-center">
        <div class="flex flex-col lg:flex-row justify-between items-center">
          <img
            class="w-36 h-36 rounded-xl ring-gray-300 dark:ring-gray-500"
            src={ProfilePicture}
            alt="Bordered avatar"
          />
          <div class="flex flex-col text-center justify-center content-center lg:pl-12 lg:text-left">
            <div class="flex flex-col lg:flex-row">
              <h1 class="text-3xl font-extrabold sm:text-5xl max-w-1/2">
                Manuel Tumiati
              </h1>
              <div class="flex flex-row justify-evenly items-center lg:w-1/2">
                <Social link={"https://github.com/iltumio"} type="Github" />
                <Social
                  link={"https://www.linkedin.com/in/manuel-tumiati/"}
                  type="LinkedIn"
                />
                <Social link={"https://twitter.com/iltumio"} type="Twitter" />
              </div>
            </div>
            <h2 class="text-xl">
              <strong class="font-extrabold text-red-700 sm:block">
                Blockchain Engineer
              </strong>
            </h2>
            <p class="mt-4 sm:leading-relaxed sm:text-l">
              I'm a passionate developer from Milan, Italy, interested into
              everything that moves around software development and blockchain
              technology
            </p>
          </div>
        </div>
      </section>
    </header>
  );
});
