import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.url.toString()} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins&amp;display=swap"
        rel="stylesheet"
      />

      <meta
        property="og:site_name"
        content="Manuel Tumiati | Web3 CTO & Blockchain engineer"
      />
      <meta name="twitter:site" content="@iltumio" />
      <meta
        name="twitter:title"
        content="Manuel Tumiati | Web3 CTO & Blockchain engineer"
      />

      {head.meta.map(({key, ...m}) => (
        <meta key={key} {...m} />
      ))}

      {head.links.map(({key,...l}) => (
        <link key={key} {...l} />
      ))}

      {head.styles.map(({key, style, props}) => (
        <style key={key} {...props} dangerouslySetInnerHTML={style} />
      ))}
    </>
  );
});
