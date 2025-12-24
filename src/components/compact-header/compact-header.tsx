import { component$ } from "@builder.io/qwik";
import ProfilePicture from "../../images/ProfilePicture.png";
import Social from "../social/social";

interface CompactHeaderProps {
  showBlogLink?: boolean;
}

export default component$(({ showBlogLink = false }: CompactHeaderProps) => {
  return (
    <header class="mb-6 w-full">
      <section class="w-full">
        <div class="flex flex-row items-start gap-4 lg:gap-6 w-full">
          <img
            class="w-16 h-16 lg:w-20 lg:h-20 rounded-xl ring-gray-300 dark:ring-gray-500 flex-shrink-0"
            src={ProfilePicture}
            alt="Bordered avatar"
          />
          <div class="flex flex-col flex-1 min-w-0">
            <div class="flex flex-row items-center justify-between gap-4 flex-wrap">
              <div class="flex flex-row items-center gap-3 flex-wrap">
                <h1 class="text-xl lg:text-2xl font-extrabold whitespace-nowrap">
                  Manuel Tumiati
                </h1>
                <h2 class="text-sm lg:text-base whitespace-nowrap">
                  <strong class="font-extrabold text-red-700">
                    Web3 CTO & Blockchain Engineer
                  </strong>
                </h2>
              </div>
              <div class="flex flex-row gap-3 text-xl lg:text-2xl">
                <Social link={"https://github.com/iltumio"} type="Github" />
                <Social
                  link={"https://www.linkedin.com/in/manuel-tumiati/"}
                  type="LinkedIn"
                />
                <Social link={"https://x.com/iltumio"} type="Twitter" />
              </div>
            </div>
            <nav class="mt-2 flex gap-4">
              <a
                href="/"
                class="text-red-700 hover:text-red-800 font-semibold transition-colors text-sm"
              >
                Home
              </a>
              {showBlogLink && (
                <a
                  href="/blog"
                  class="text-red-700 hover:text-red-800 font-semibold transition-colors text-sm"
                >
                  Blog
                </a>
              )}
            </nav>
          </div>
        </div>
      </section>
    </header>
  );
});

