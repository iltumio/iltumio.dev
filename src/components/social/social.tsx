import { component$ } from "@builder.io/qwik";
import {
  SiX as Twitter,
  SiLinkedin as LinkedIn,
  SiGithub as Github,
} from "@qwikest/icons/simpleicons";

type SocialProps = {
  link: string;
  type: "Github" | "Twitter" | "LinkedIn";
};

export default component$(({ link, type }: SocialProps) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label={`${type} profile`}
      class="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-all duration-300 transform hover:scale-110"
    >
      {type === "Github" && <Github class="w-6 h-6" />}
      {type === "Twitter" && <Twitter class="w-6 h-6" />}
      {type === "LinkedIn" && <LinkedIn class="w-6 h-6" />}
    </a>
  );
});
