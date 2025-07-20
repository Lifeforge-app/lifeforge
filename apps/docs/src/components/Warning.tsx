import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

function Warning({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`quote w-full p-4 bg-bg-800/70 mt-6 rounded-md border-l-4 border-amber-500 ${className}`}
    >
      <div className="flex items-center gap-2">
        <Icon icon="tabler:alert-triangle" className="w-6 h-6 text-amber-500" />
        <h3 className="text-xl font-semibold">Warning</h3>
      </div>
      <p className="text-base -mt-2">{children}</p>
    </div>
  );
}

export default Warning;
