import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState, useRef } from "react";
import { toLinkCase, toTitleCase } from "../utils/string";
import { useLocation } from "react-router-dom";

function Rightbar() {
  const [allSections, setAllSections] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const location = useLocation();
  const userClickedRef = useRef(false);
  const userClickTimeoutRef = useRef<number | null>(null);

  // Apply aria-current attribute whenever activeSection changes
  useEffect(() => {
    if (activeSection) {
      document.querySelectorAll("li[aria-current=page]").forEach((li) => {
        li.removeAttribute("aria-current");
      });

      const activeLink = document.querySelector(`li a#${activeSection}`);
      if (activeLink?.parentElement) {
        activeLink.parentElement.setAttribute("aria-current", "page");
      }
    }
  }, [activeSection]);

  useEffect(() => {
    const sections = document.querySelectorAll("article section");
    const _allSections: string[] = [];
    sections.forEach((heading) => {
      _allSections.push(heading.querySelector("h2,h6")?.textContent || "");
    });
    setAllSections(_allSections);

    setActiveSection("");

    const sectionIntersectionRatios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        // Don't update if the user just clicked a link
        if (userClickedRef.current) return;

        entries.forEach((entry) => {
          const id = entry.target.id || "";
          const sanitizedId = toLinkCase(id);

          sectionIntersectionRatios.set(sanitizedId, entry.intersectionRatio);
        });

        let highestRatio = 0;
        let mostVisibleSection = "";

        sectionIntersectionRatios.forEach((ratio, id) => {
          if (ratio > highestRatio) {
            highestRatio = ratio;
            mostVisibleSection = id;
          }
        });

        if (mostVisibleSection && mostVisibleSection !== activeSection) {
          setActiveSection(mostVisibleSection);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: "-10% 0px -70% 0px",
      }
    );

    sections.forEach((section) => {
      if (section.id) {
        observer.observe(section);
      } else {
        const heading = section.querySelector("h2,h6");
        if (heading && heading.textContent) {
          section.id = toLinkCase(heading.textContent.replace(/\./g, ""));
          observer.observe(section);
        }
      }
    });

    // Set the first section as active after processing all sections
    if (_allSections.length > 0) {
      const firstSectionId = toLinkCase(_allSections[0].replace(/\./g, ""));
      setActiveSection(firstSectionId);
    }

    return () => {
      document.querySelectorAll("li[aria-current=page]").forEach((li) => {
        li.removeAttribute("aria-current");
      });
      observer.disconnect();

      if (userClickTimeoutRef.current) {
        window.clearTimeout(userClickTimeoutRef.current);
      }
    };
  }, [location]);

  const handleSectionClick = (itemId: string) => {
    // Set active section immediately
    setActiveSection(itemId);

    // Manually scroll to the section
    setTimeout(() => {
      const sectionElement = document.getElementById(itemId);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);

    // Temporarily disable the intersection observer's effect
    userClickedRef.current = true;

    // Clear any existing timeout
    if (userClickTimeoutRef.current) {
      window.clearTimeout(userClickTimeoutRef.current);
    }

    // Re-enable the intersection observer after a delay
    userClickTimeoutRef.current = window.setTimeout(() => {
      userClickedRef.current = false;
    }, 1000); // 1 second delay to allow scroll to finish
  };

  return (
    <aside className="w-80 fixed top-20 hidden lg:block right-0 h-full p-12 overflow-y-auto min-h-0">
      <h2 className="text-lg font-semibold">On This Page</h2>
      <ul className="mt-4 relative before:z-[-1] isolate before:h-full before:border-r-[1.5px] before:border-bg-800 before:absolute before:top-0 before:left-0">
        {allSections.map((item, index) => {
          const itemId = toLinkCase(item.replace(/\./g, ""));
          return (
            <a
              key={index}
              id={itemId}
              href={`#${itemId}`}
              onClick={(e) => {
                e.preventDefault(); // Prevent default anchor behavior
                handleSectionClick(itemId);
              }}
              className="py-2 block px-4 cursor-pointer aria-[current=page]:font-semibold aria-[current=page]:text-primary aria-[current=page]:border-l-[2.5px] aria-[current=page]:border-primary text-bg-500 hover:text-bg-100 hover:font-medium"
              aria-current={activeSection === itemId ? "page" : undefined}
            >
              {item}
            </a>
          );
        })}
      </ul>
      <a
        href={`https://github.com/melvinchia3636/lifeforge-documentation/edit/main/src/contents/${
          location.pathname.split("/")?.[1]
        }/${toTitleCase(
          location.pathname.split("/")?.[2]?.replace(/-/g, " ") || ""
        )}.mdx`}
        target="_blank"
        rel="noreferrer"
        className="mt-6 flex items-center font-medium gap-2 text-bg-100 hover:underline"
      >
        Edit this page
        <Icon icon="tabler:arrow-up-right" className="w-5 h-5 -mb-1" />
      </a>
      <a
        href="https://github.com/melvinchia3636/lifeforge/issues/new"
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex items-center font-medium gap-2 text-bg-100 hover:underline"
      >
        Issue Report
        <Icon icon="tabler:arrow-up-right" className="w-5 h-5 -mb-1" />
      </a>
      <a
        href="https://github.com/melvinchia3636/lifeforge"
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex items-center font-medium gap-2 text-bg-100 hover:underline"
      >
        Star on GitHub
        <Icon icon="tabler:arrow-up-right" className="w-5 h-5 -mb-1" />
      </a>
    </aside>
  );
}

export default Rightbar;
