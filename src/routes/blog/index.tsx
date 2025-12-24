import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { getAllPosts, type BlogPost } from "~/lib/blog";
import CompactHeader from "~/components/compact-header/compact-header";

export const useBlogPosts = routeLoader$(async () => {
  return await getAllPosts();
});

export default component$(() => {
  const posts = useBlogPosts();
  
  const gridCols = posts.value.length >= 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
    : posts.value.length === 2 ? "grid-cols-1 md:grid-cols-2" 
    : "grid-cols-1";

  return (
    <main class="bg-gray-50 min-h-screen flex flex-col items-center pt-8">
      <div class="p-2 lg:p-0 lg:max-w-6xl flex flex-col w-full">
        <CompactHeader showBlogLink={true} />
        
        <section class="mt-8 w-full">
          <div class="mb-8">
            <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Blog</h1>
            <p class="text-xl text-gray-600">
              Thoughts, insights, and updates from my journey in Web3 and blockchain engineering.
            </p>
          </div>

          {posts.value.length === 0 ? (
            <div class="text-center py-12 bg-white rounded-lg shadow-md p-6">
              <p class="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div class={`grid ${gridCols} gap-6`}>
              {posts.value.map((post: BlogPost) => (
                <article
                  key={post.slug}
                  class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <a href={`/blog/${post.slug}`} class="block">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2 hover:text-red-700 transition-colors">
                      {post.title}
                    </h2>
                    {post.description && (
                      <p class="text-gray-600 mb-4">{post.description}</p>
                    )}
                    <div class="flex items-center text-sm text-gray-500">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Blog | Manuel Tumiati",
  meta: [
    {
      name: "description",
      content: "Blog posts about Web3, blockchain engineering, and digital identity.",
    },
  ],
};

