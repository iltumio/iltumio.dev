import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider as QwikCity,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCity> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  return (
    <QwikCity>
      <head>
        <meta charset="utf-8" />
        <RouterHead />
        <script
          dangerouslySetInnerHTML={`
            (function() {
              const storedTheme = localStorage.getItem("theme");
              if (storedTheme === "dark") {
                document.documentElement.classList.add("dark");
              } else {
                document.documentElement.classList.remove("dark");
              }
            })();
          `}
        />
      </head>
      <body lang="en" class="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCity>
  );
});
