import { component$, Slot } from "@builder.io/qwik";

type SkillProps = { name: string };
export default component$(({ name }: SkillProps) => {
  return (
    <div class="group flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default">
      <div class="text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-xl shrink-0">
        <Slot name="icon" />
      </div>
      <div class="font-medium text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white truncate">
        {name}
      </div>
    </div>
  );
});
