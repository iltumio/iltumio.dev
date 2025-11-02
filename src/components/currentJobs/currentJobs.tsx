import { component$ } from "@builder.io/qwik";
import JobPosition from "../jobPosition/jobPosition";

export default component$(() => {
  return (
    <div class="flex flex-col items-center">
      <h2 class="text-xl font-bold pb-4 pt-4">Current Job</h2>
      <div class="w-full">
        <JobPosition
          name="Zyphe Inc."
          role="Co-founder &amp; Chief Technology Officer"
          description="Redefining digital identity with seamless, innovative solutions for everyone"
          image="/zyphe-logotype.svg"
          link="https://zyphe.com"
          linkedin="https://www.linkedin.com/company/zyphe"
          twitter="https://x.com/zyphe_official"
          from="Dec. 2024"
          to="now"
          highlight
        />
      </div>
    </div>
  );
});
