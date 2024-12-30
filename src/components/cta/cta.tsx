import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { addCalendlyScripts } from "~/utils";
import { HiCalendarDaysSolid } from "@qwikest/icons/heroicons";

declare global {
  interface Window {
    Calendly: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export default component$(() => {
  const scriptsAdded = useSignal(false);

  useVisibleTask$(() => {
    addCalendlyScripts();
    scriptsAdded.value = true;
  });

  const handleClick = $(() => {
    window.Calendly.initPopupWidget({
      url: "https://calendly.com/manuel-zyphe/meet-manuel",
    });
  });

  return (
    <div class="flex flex-col items-center">
      <h2 class="text-xl font-bold pb-4 pt-4">Let's connect</h2>
      <div class="flex justify-center items-center">
        {scriptsAdded.value && (
          <>
            <button
              class="bg-blue-500 text-white p-4 rounded-full flex items-center gap-2 text-2xl hover:bg-blue-600 shadow-lg"
              onClick$={handleClick}
            >
              <HiCalendarDaysSolid />
              Schedule time with me
            </button>
          </>
        )}
      </div>
    </div>
  );
});
