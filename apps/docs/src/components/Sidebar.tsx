import { Link, useLocation } from "react-router-dom";
import { toLinkCase } from "../utils/string";
import SECTIONS from "../constants/Sections";
import { Scrollbars } from "react-custom-scrollbars";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}) {
  const location = useLocation();

  return (
    <>
      <div
        className={`w-full h-screen fixed top-0 left-0 transition-all ${
          sidebarOpen
            ? "bg-black/20 backdrop-blur-md z-40"
            : "bg-transparent filter-none z-[-1]"
        }`}
      ></div>
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
        } w-full sm:w-3/4 md:w-1/2 xl:w-80 z-50 bg-bg-900 h-[calc(100%-2rem)] transition-all fixed left-0 flex-1 overflow-y-auto`}
      >
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
          <div className="p-12 space-y-6">
            {Object.entries(SECTIONS).map(([title, items]) => (
              <div key={title}>
                <h2 className="text-lg font-semibold">{title}</h2>
                <div className="mt-4 relative before:z-[-1] isolate before:h-full before:border-r-[1.5px] before:border-bg-800 before:absolute before:top-0 before:left-0">
                  {items.map((item) => (
                    <Link
                      onClick={() => {
                        document.querySelector("main")?.scrollTo(0, 0);
                        setSidebarOpen(false);
                      }}
                      to={`/${toLinkCase(title)}/${toLinkCase(item)}`}
                      key={`${title}-${item}`}
                      className={`py-2 px-4 block cursor-pointer transition-all ${
                        location.pathname ===
                        `/${toLinkCase(title)}/${toLinkCase(item)}`
                          ? "font-semibold text-primary border-l-[2.5px] border-primary hover:border-primary"
                          : "text-bg-500 hover:text-bg-100 hover:font-medium"
                      }`}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Scrollbars>
      </aside>
    </>
  );
}

export default Sidebar;
