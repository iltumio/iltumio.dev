import { component$ } from "@builder.io/qwik";
import {
  SiX as Twitter,
  SiLinkedin as LinkedIn,
} from "@qwikest/icons/simpleicons";

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
          <div class="flex items-center justify-center p-4">
            <div class="w-14 h-14">
              <a href={link} target="_blank" rel="noreferrer">
                <img src={image} alt="" width={50} height={50} />
              </a>
            </div>
          </div>
          <div class="flex flex-col flex-1">
            <div class="text-bold text-xl pb-2">{name}</div>
            <div class="text-bold text-sm pb-2">{role}</div>
            <span class="text-bold text-sm text-gray-500 pb-2">{`${from} - ${to}`}</span>
            <div class="text-bold text-sm text-gray-600 pb-2">
              {description}
            </div>
            {(linkedin || twitter) && (
              <div class="flex gap-3 pt-2">
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    class="hover:text-cyan-600 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
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
                    class="hover:text-cyan-600 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
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
