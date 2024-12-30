import { component$ } from "@builder.io/qwik";

type JobPositionProps = {
  image: string;
  name: string;
  description: string;
  link: string;
  from: string;
  to: string;
  role: string;
  highlight?: boolean;
};
export default component$(
  ({
    image,
    name,
    description,
    from,
    to,
    role,
    link,
    highlight = false,
  }: JobPositionProps) => {
    return (
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        class={`flex justify-center shadow-lg p-4 rounded-lg mx-2 mt-4 ${highlight ? "bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100" : "bg-gray-100"}`}
      >
        <div class="flex flex-row">
          <div class="flex items-center justify-center p-4">
            <div class="w-14 h-14">
              <img src={image} alt="" width={50} height={50} />
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
  },
);
