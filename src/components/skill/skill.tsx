import { component$, JSXChildren } from "@builder.io/qwik";

type SkillProps = { icon: JSXChildren; name: string };
export default component$(({ icon, name }: SkillProps) => {
  return (
    <div class="flex flex-row items-center">
      <div class="flex p-2">{icon}</div>
      <div class="text-bold text-l">{name}</div>
    </div>
  );
});
