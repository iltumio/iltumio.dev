import { component$ } from "@builder.io/qwik";
import { HiCalendarDaysSolid } from "@qwikest/icons/heroicons";

export default component$(() => {
  return (
    <div class="flex flex-col items-center">
      <div class="flex justify-center items-center w-full max-w-sm">
        <a
          href="https://calendar.notion.so/meet/manueltumiati/free-booking"
          target="_blank"
          rel="noreferrer"
          class="btn-main-link group w-full"
        >
          <span class="relative bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full flex items-center justify-center gap-3 font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
            <HiCalendarDaysSolid class="w-6 h-6" />
            Book a meeting
          </span>
        </a>
      </div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        Let's discuss your next project or just say hi!
      </p>
    </div>
  );
});
