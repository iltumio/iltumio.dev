import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export const ThemeToggle = component$(() => {
  const theme = useSignal<"light" | "dark">("light");

  // Initialize theme from localStorage, default to light
  useVisibleTask$(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      theme.value = storedTheme as "light" | "dark";
    } else {
      theme.value = "light";
    }
    
    // Ensure the class matches the state
    if (theme.value === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  return (
    <button
      onClick$={() => {
        const newTheme = theme.value === "light" ? "dark" : "light";
        theme.value = newTheme;
        
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        
        localStorage.setItem("theme", newTheme);
      }}
      class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
      title={`Switch to ${theme.value === "light" ? "dark" : "light"} mode`}
    >
      {theme.value === "light" ? (
        // Moon icon for light mode (to switch to dark)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-gray-800"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        // Sun icon for dark mode (to switch to light)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-yellow-400"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )}
    </button>
  );
});

