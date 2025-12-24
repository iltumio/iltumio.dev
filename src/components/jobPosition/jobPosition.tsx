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
        class={`flex justify-center shadow-lg p-4 rounded-lg mx-2 mt-4 ${highlight ? "bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100" : "bg-gray-100"}`}
      >
        <div class="flex flex-row w-full">
          <div class="flex justify-center items-center p-4">
            <div class="w-14 h-14">
              <a href={link} target="_blank" rel="noreferrer">
                <img src={image} alt="" width={50} height={50} />
              </a>
            </div>
          </div>
          <div class="flex flex-col flex-1">
            <div class="pb-2 text-xl text-bold">{name}</div>
            <div class="pb-2 text-sm text-bold">{role}</div>
            <span class="pb-2 text-sm text-gray-500 text-bold">{`${from} - ${to}`}</span>
            <div class="pb-2 text-sm text-gray-600 text-bold">
              {description}
            </div>
            {(linkedin || twitter || link) && (
              <div class="flex gap-3 items-center pt-2">
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    class="transition duration-300 ease-in-out hover:text-cyan-600 hover:-translate-y-1 hover:scale-110"
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
                    class="transition duration-300 ease-in-out hover:text-cyan-600 hover:-translate-y-1 hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <LinkedIn width={20} height={20} />
                  </a>
                )}
                {twitter && (
                  <a
                    href={twitter}
                    target="_blank"
                    rel="noreferrer"
                    class="transition duration-300 ease-in-out hover:text-cyan-600 hover:-translate-y-1 hover:scale-110"
                    aria-label="Twitter"
                  >
                    <Twitter width={20} height={20} />
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
