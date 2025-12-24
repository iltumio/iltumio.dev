import { component$ } from "@builder.io/qwik";
import {
  SiX as Twitter,
  SiLinkedin as LinkedIn,
} from "@qwikest/icons/simpleicons";
import { LuGlobe as Globe } from "@qwikest/icons/lucide";

type JobPositionProps = {
  image: string;
  name: string;
  description: string;
  link: string;
  from: string;
  to: string;
  role: string;
  highlight?: boolean;
  linkedin?: string;
  twitter?: string;
};
export default component$(
  ({
    image,
    name,
    description,
    from,
    to,
    role,
    link,
    highlight = false,
    linkedin,
    twitter,
  }: JobPositionProps) => {
    return (
      <div
        class={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl
          ${
            highlight
              ? "bg-white dark:bg-gray-900 border-purple-100 dark:border-purple-900/50 shadow-lg shadow-purple-500/5"
              : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
          }
        `}
      >
        {highlight && (
          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-linear-to-br from-purple-500 to-pink-500 blur-2xl opacity-20 dark:opacity-40"></div>
        )}

        <div class="flex flex-col md:flex-row gap-6 p-6 md:p-8 relative z-10">
          <div class="shrink-0">
            <div class="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden p-4">
              <img
                src={image}
                alt={name}
                class="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <div class="flex flex-col flex-1 gap-2">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {name}
                </h3>
                <p class="text-lg font-medium text-purple-600 dark:text-purple-400">
                  {role}
                </p>
              </div>
              <span class="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wide whitespace-nowrap self-start">
                {from} - {to}
              </span>
            </div>

            <p class="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
              {description}
            </p>

            {(linkedin || twitter || link) && (
              <div class="flex gap-4 items-center mt-4">
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    class="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    aria-label="Website"
                  >
                    <Globe class="w-5 h-5" />
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    class="text-gray-400 hover:text-[#0077b5] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <LinkedIn class="w-5 h-5" />
                  </a>
                )}
                {twitter && (
                  <a
                    href={twitter}
                    target="_blank"
                    rel="noreferrer"
                    class="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter class="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
