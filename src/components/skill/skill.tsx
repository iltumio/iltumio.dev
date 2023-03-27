import { component$, Slot } from "@builder.io/qwik";

type SkillProps = { name: string };
export default component$(({ name }: SkillProps) => {
  return (
    <div class="flex flex-row items-center">
      <div class="flex p-2">
        <Slot name="icon" />
      </div>
      <div class="text-bold text-l">{name}</div>
    </div>
  );
});
