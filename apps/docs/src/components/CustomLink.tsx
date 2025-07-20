import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

function CustomLink({ text, to }: { text: string; to: string }) {
  return (
    <Link
      to={to}
      className="mt-6 text-lg flex items-center font-medium gap-2 text-primary hover:underline"
    >
      {text}
      <Icon icon="tabler:arrow-right" className="w-5 h-5 -mb-1" />
    </Link>
  );
}

export default CustomLink;
