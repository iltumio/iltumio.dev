import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { getPostBySlug, getAllSlugs } from "~/lib/blog";
import { notFound } from "@builder.io/qwik-city";
import CompactHeader from "~/components/compact-header/compact-header";

export const usePost = routeLoader$(async ({ params, status }) => {
  try {
    const post = await getPostBySlug(params.slug);
    return post;
  } catch (error) {
    status(404);
    throw notFound();
  }
});

export const usePostSlugs = routeLoader$(async () => {
  return await getAllSlugs();
});

export default component$(() => {
  const post = usePost();

  return (
    <main class="bg-gray-50 min-h-screen flex flex-col items-center pt-8">
      <div class="p-2 lg:p-0 lg:max-w-6xl flex flex-col w-full">
        <CompactHeader showBlogLink={true} />
        
        <section class="mt-8 w-full">
          <article class="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <header class="mb-8">
              <nav class="mb-4">
                <a
                  href="/blog"
                  class="text-red-700 hover:text-red-800 font-semibold transition-colors inline-block text-sm"
                >
                  ← Back to Blog
                </a>
              </nav>
              <h1 class="text-4xl font-extrabold text-gray-900 mb-4">
                {post.value.title}
              </h1>
              <div class="flex items-center text-sm text-gray-500 mb-6">
                <time dateTime={post.value.date}>
                  {new Date(post.value.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </header>

            <div
              class="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-700 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-red-700 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={post.value.htmlContent}
            />
          </article>
        </section>
      </div>
    </main>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const post = resolveValue(usePost);
  if (!post) {
    return {
      title: "Post Not Found | Manuel Tumiati's Blog",
    };
  }
  return {
    title: `${post.title} | Manuel Tumiati's Blog`,
    meta: [
      {
        name: "description",
        content: post.description || post.title,
      },
    ],
  };
};

