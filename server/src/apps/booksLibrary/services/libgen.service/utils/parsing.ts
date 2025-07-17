export const cleanupTitle = (title: Element | null) => {
  if (title === null) return "";
  const el = title.querySelectorAll("font");
  let edition = "";
  if (el) {
    edition =
      Array.from(el)
        .find((e) => e.textContent?.trim().match(/^\[.*?\]$/))
        ?.textContent?.trim() || "";
    el.forEach((e) => e.remove());
  }
  return {
    title: title.textContent?.trim(),
    edition,
  };
};

export const zip = (a: Array<string>, b: Array<any> | null) => {
  if (b)
    return Object.fromEntries(a.map((k, i) => [k, b[i]]).filter((e) => e[0]));
  return a;
};
