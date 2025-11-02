import { component$ } from "@builder.io/qwik";
import { HiCalendarDaysSolid } from "@qwikest/icons/heroicons";

export default component$(() => {
  return (
    <div class="flex flex-col items-center">
      <h2 class="text-xl font-bold pb-4 pt-4">Let's connect</h2>
      <div class="flex justify-center items-center">
        <a
          href="https://calendar.notion.so/meet/manueltumiati/free-booking"
          target="_blank"
          rel="noreferrer"
          class="btn-main-link flex items-center gap-2 text-xl shadow-lg"
        >
          <span class="bg-white text-black p-4 rounded-full flex items-center gap-2 hover:bg-gray-100 transition-colors w-full">
            <HiCalendarDaysSolid />
            Book a meeting
          </span>
        </a>
      </div>
    </div>
  );
});
