import { Icon } from "@iconify/react/dist/iconify.js";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import SECTIONS from "../../../constants/Sections";
import { toLinkCase, toTitleCase } from "../../../utils/string";

function NavigationBar() {
  const location = useLocation();
  const currentGroup = useMemo(
    () => location.pathname.split("/")[1],
    [location]
  );
  const currentSection = useMemo(
    () => location.pathname.split("/")[2],
    [location]
  );

  const nextSection = useMemo(() => {
    const sectionLinkCase = Object.fromEntries(
      Object.entries(SECTIONS).map(([title, items]) => {
        return [toLinkCase(title), items.map(toLinkCase)];
      })
    );

    const currentGroupIndex =
      Object.keys(sectionLinkCase).indexOf(currentGroup);

    if (currentGroupIndex === -1) return null;

    const currentSectionIndex =
      sectionLinkCase[currentGroup].indexOf(currentSection);

    if (currentSectionIndex === -1) return null;

    if (currentSectionIndex === sectionLinkCase[currentGroup].length - 1) {
      if (currentGroupIndex === Object.keys(sectionLinkCase).length - 1) {
        return null;
      }

      return {
        group: Object.keys(sectionLinkCase)[currentGroupIndex + 1],
        section:
          sectionLinkCase[
            Object.keys(sectionLinkCase)[currentGroupIndex + 1]
          ][0],
      };
    }

    return {
      group: currentGroup,
      section: sectionLinkCase[currentGroup][currentSectionIndex + 1],
    };
  }, [currentGroup, currentSection]);

  const lastSection = useMemo(() => {
    const sectionLinkCase = Object.fromEntries(
      Object.entries(SECTIONS).map(([title, items]) => {
        return [toLinkCase(title), items.map(toLinkCase)];
      })
    );

    const currentGroupIndex =
      Object.keys(sectionLinkCase).indexOf(currentGroup);

    if (currentGroupIndex === -1) return null;

    const currentSectionIndex =
      sectionLinkCase[currentGroup].indexOf(currentSection);

    if (currentSectionIndex === -1) return null;

    if (currentSectionIndex === 0) {
      if (currentGroupIndex === 0) {
        return null;
      }

      return {
        group: Object.keys(sectionLinkCase)[currentGroupIndex - 1],
        section:
          sectionLinkCase[Object.keys(sectionLinkCase)[currentGroupIndex - 1]][
            sectionLinkCase[Object.keys(sectionLinkCase)[currentGroupIndex - 1]]
              .length - 1
          ],
      };
    }

    return {
      group: currentGroup,
      section: sectionLinkCase[currentGroup][currentSectionIndex - 1],
    };
  }, [currentGroup, currentSection]);

  return (
    <div className="flex items-center justify-between mt-12">
      {lastSection ? (
        <Link
          to={`/${lastSection.group}/${lastSection.section}`}
          className="text-lg flex items-center font-medium gap-2 text-bg-100 hover:underline"
        >
          <Icon icon="tabler:arrow-left" className="w-5 h-5 shrink-0 -mb-1" />
          {toTitleCase(lastSection.section)}
        </Link>
      ) : (
        <span />
      )}
      {nextSection && (
        <Link
          to={`/${nextSection.group}/${nextSection.section}`}
          className="text-lg flex items-center font-medium gap-2 text-bg-100 hover:underline"
        >
          {toTitleCase(nextSection.section)}
          <Icon icon="tabler:arrow-right" className="w-5 h-5 shrink-0 -mb-1" />
        </Link>
      )}
    </div>
  );
}

export default NavigationBar;
