import { IconAward } from "@tabler/icons-react";
import { lazy } from "react";

export default {
  name: "Achievements",
  icon: <IconAward />,
  routes: {
    achievements: lazy(() => import("./index")),
  },
  togglable: true,
};
