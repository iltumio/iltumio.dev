import { component$ } from "@builder.io/qwik";
import ProfilePicture from "../../images/ProfilePicture.png";
import Social from "../social/social";
import { ThemeToggle } from "../theme-toggle/theme-toggle";

export default component$(() => {
  return (
    <header class="w-full pt-12 pb-8">
      <div class="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
        <div class="relative group shrink-0">
          <div class="absolute -inset-1 bg-linear-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <img
            class="relative w-40 h-40 lg:w-48 lg:h-48 rounded-2xl object-cover shadow-2xl ring-4 ring-white dark:ring-gray-800"
            src={ProfilePicture}
            alt="Manuel Tumiati"
            width={192}
            height={192}
          />
        </div>

        <div class="flex flex-col text-center lg:text-left flex-1 space-y-4">
          <div class="space-y-2">
            <h1 class="text-4xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Manuel <span class="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">Tumiati</span>
            </h1>
            <h2 class="text-xl lg:text-2xl font-medium text-gray-600 dark:text-gray-300">
              Web3 CTO & Blockchain Engineer
            </h2>
          </div>

          <div class="flex items-center justify-center lg:justify-start gap-4">
            <div class="flex gap-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              <Social link={"https://github.com/iltumio"} type="Github" />
              <Social
                link={"https://www.linkedin.com/in/manuel-tumiati/"}
                type="LinkedIn"
              />
              <Social link={"https://x.com/iltumio"} type="Twitter" />
            </div>
            <ThemeToggle />
             <a
              href="/blog"
              class="px-6 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Blog
            </a>
          </div>

          <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            I specialize in <span class="font-semibold text-gray-900 dark:text-white">blockchain architecture</span> and <span class="font-semibold text-gray-900 dark:text-white">smart contract development</span>. 
            Deeply committed to advancing digital identity through self-sovereign identity principles and <span class="font-semibold text-gray-900 dark:text-white">zero-knowledge proofs</span>.
          </p>
        </div>
      </div>
    </header>
  );
});
