import { component$ } from "@builder.io/qwik";

type JobPositionProps = {
  image: string;
  name: string;
  description: string;
  link: string;
  from: string;
  to: string;
  role: string;
};
export default component$(
  ({ image, name, description, from, to, role, link }: JobPositionProps) => {
    return (
      <a href={link} target="_blank">
        <div class="flex flex-row">
          <div class="flex items-center justify-center p-4">
            <div class="w-14 h-14">
              <img src={image} alt="" />
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-bold text-xl pb-2">{name}</div>
            <div class="text-bold text-sm pb-2">{role}</div>
            <span class="text-bold text-sm text-gray-500 pb-2">{`${from} - ${to}`}</span>
            <div class="text-bold text-sm text-gray-600 pb-2">
              {description}
            </div>
          </div>
        </div>
      </a>
    );
  }
);
