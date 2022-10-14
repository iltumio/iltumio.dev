import { component$ } from "@builder.io/qwik";
import { LinkedIn, Twitter, Github } from "../icons";

export const SocialIcons = { LinkedIn, Twitter, Github };

type SocialProps = {
  link: string;
  type: keyof typeof SocialIcons;
  size?: number;
};

export default component$(({ link, type, size }: SocialProps) => {
  const Icon = SocialIcons[type];
  const iconSize = size || 30;
  return (
    <a
      href={link}
      target="_blank"
      class="hover:text-cyan-600 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
    >
      {<Icon width={iconSize} height={iconSize} />}
    </a>
  );
});
