import { component$ } from "@builder.io/qwik";
import JobPosition from "../jobPosition/jobPosition";

export default component$(() => {
  return (
    <div class="flex flex-col w-full">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Current Positions
        </h2>
        <div class="flex-1 ml-6 h-1 bg-gray-100 rounded-full dark:bg-gray-800"></div>
      </div>
      <div class="w-full">
        <JobPosition
          name="Zyphe Inc."
          role="Co-founder & Chief Technology Officer"
          description="Redefining digital identity with seamless, innovative solutions for everyone."
          image="/zyphe-logotype.svg"
          link="https://zyphe.com"
          linkedin="https://www.linkedin.com/company/zyphe"
          twitter="https://x.com/zyphe_official"
          from="Dec. 2024"
          to="Present"
          highlight
        />
      </div>
    </div>
  );
});
