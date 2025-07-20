import { Icon } from "@iconify/react/dist/iconify.js";
import { Outlet, useLocation } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import { useEffect } from "react";
import Scrollbars from "react-custom-scrollbars";

function Boilerplate() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      document
        .querySelector("section")
        ?.parentElement?.parentElement?.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <article className="flex-1 relative xl:ml-[20rem] h-full p-6 sm:p-12 !pb-0 overflow-y-auto min-h-0">
      <Scrollbars
        renderThumbVertical={({ style, ...props }) => (
          <div
            {...props}
            style={{
              ...style,
            }}
            className="bg-bg-800 rounded-md"
          />
        )}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
      >
        <div className="w-full lg:w-[calc(100%-20rem)] min-w-0">
          <Outlet />
          <NavigationBar />
          <hr className="my-12 border-t-[1.5px] border-bg-800" />
          <div className="flex flex-col items-center justify-center gap-2 pb-6 sm:pb-12">
            <div className="flex items-center gap-2 text-bg-500">
              <Icon icon="tabler:creative-commons" className="size-6" />
              <Icon icon="tabler:creative-commons-by" className="size-6" />
              <Icon icon="tabler:creative-commons-nc" className="size-6" />
              <Icon icon="tabler:creative-commons-sa" className="size-6" />
            </div>
            <p className="text-center text-sm text-bg-500">
              A project by{" "}
              <a
                className="text-primary underline"
                target="_blank"
                href="https://thecodeblog.net"
                rel="noreferrer"
              >
                Melvin Chia
              </a>{" "}
              licensed under{" "}
              <a
                className="text-primary underline"
                target="_blank"
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                rel="noreferrer"
              >
                CC BY-NC-SA 4.0
              </a>
              .
            </p>
          </div>
        </div>
      </Scrollbars>
    </article>
  );
}

export default Boilerplate;
