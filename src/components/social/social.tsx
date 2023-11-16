import { component$ } from "@builder.io/qwik";
import {
  SiX as Twitter,
  SiGithub as Github,
  SiLinkedin as LinkedIn,
} from "@qwikest/icons/simpleicons";

export const SocialIcons = { LinkedIn, Twitter, Github };

type SocialProps = {
  link: string;
  type: keyof typeof SocialIcons;
  size?: number;
};

export default component$((props: SocialProps) => {
  const Icon = SocialIcons[props.type];
  const iconSize = props.size || 30;
  return (
    <a
      href={props.link}
      target="_blank"
      class="hover:text-cyan-600 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
    >
      {<Icon width={iconSize} height={iconSize} />}
    </a>
  );
});
