import { JSDOM } from "jsdom";
import { BooksLibraryCollectionsSchemas } from "shared/types/collections";

export const searchBooks = async (queries: {
  provider: string;
  req: string;
  page: string;
}): Promise<BooksLibraryCollectionsSchemas.IBooksLibraryLibgenSearchResult> => {
  const target = new URL(
    queries.provider === "libgen.is"
      ? "http://libgen.is/search.php?lg_topic=libgen&open=0&view=detailed&res=25&column=def&phrase=0&sort=year&sortmode=DESC"
      : `https://${queries.provider}/index.php?columns%5B%5D=t&columns%5B%5D=a&columns%5B%5D=s&columns%5B%5D=y&columns%5B%5D=p&columns%5B%5D=i&objects%5B%5D=f&objects%5B%5D=a&objects%5B%5D=p&topics%5B%5D=l&res=25&covers=on&filesuns=all&order=year&ordermode=desc`,
  );

  target.searchParams.set("req", queries.req);
  target.searchParams.set("page", queries.page);

  try {
    const data = await fetch(target.href).then((res) => res.text());

    const dom = new JSDOM(data);

    const document = dom.window.document;

    let final: BooksLibraryCollectionsSchemas.IBooksLibraryLibgenSearchResult["data"] =
      [];
    let resultsCount = "";

    if (queries.provider === "libgen.is") {
      [final, resultsCount] = parseLibgenIS(document);
    } else {
      [final, resultsCount] = parseLibgenMirror(queries.provider, document);
    }

    return {
      provider: queries.provider,
      query: queries.req,
      resultsCount,
      data: final,
      page: parseInt(queries.page),
    };
  } catch (error) {
    return {
      provider: queries.provider,
      query: queries.req,
      resultsCount: "",
      data: [],
      page: parseInt(queries.page),
    };
  }
};

function parseLibgenIS(
  document: Document,
): [
  BooksLibraryCollectionsSchemas.IBooksLibraryLibgenSearchResult["data"],
  BooksLibraryCollectionsSchemas.IBooksLibraryLibgenSearchResult["resultsCount"],
] {
  const table = Array.from(
    document.querySelectorAll('body > table[rules="cols"]'),
  );

  return [
    table
      .map(
        (item) =>
          ({
            ...Object.fromEntries(
              (
                Array.from(item.querySelectorAll("tr"))
                  .map((e) => e.textContent?.trim())
                  .filter((e) => e)
                  .map((e) => e?.split("\n"))
                  .map((e) => (e!.length % 2 ? e?.concat([""]) : e))
                  .map((e) =>
                    e!.reduce((all, one, i) => {
                      const ch = Math.floor(i / 2);

                      // @ts-ignore
                      all[ch] = [].concat(all[ch] || [], one);
                      return all;
                    }, []),
                  ) as never as [string, string][]
              )
                .flat()
                .map((e) => [
                  e[0].split(":")[0],
                  e[1] || e[0].split(":")[1].trim(),
                ]),
            ),
            md5: Array.from(item.querySelectorAll("a"))
              .find((e) => e.href.includes("?md5="))
              ?.href.split("=")?.[1],
            image: item.querySelector("img")?.src,
          }) as never as Record<string, string | undefined>,
      )
      .filter((e) => Object.keys(e).length > 1),
    document.querySelector("font[color='grey']")?.textContent || "0",
  ];
}

function parseLibgenMirror(
  provider: string,
  document: Document,
): [
  BooksLibraryCollectionsSchemas.IBooksLibraryLibgenSearchResult["data"],
  BooksLibraryCollectionsSchemas.IBooksLibraryLibgenSearchResult["resultsCount"],
] {
  return [
    Array.from(document.querySelectorAll("#tablelibgen tbody tr")).map((e) => ({
      image: `https://${provider}${e.querySelector("img")?.src.replace("_small", "")}`,
      ...(() => {
        const titleElement = Array.from(e.querySelectorAll("a[title]")).filter(
          (e) => e.textContent?.trim(),
        )[0];

        return {
          Title: titleElement.textContent?.trim() || "",
          Edition: titleElement.querySelector("i")?.textContent?.trim() || "",
        };
      })(),
      ISBN: e.querySelector("font[color='green']")?.textContent?.trim() || "",
      "Author(s)":
        e.querySelector("td:nth-child(3)")?.textContent?.trim() || "",
      Publisher: e.querySelector("td:nth-child(4)")?.textContent?.trim() || "",
      Year: e.querySelector("td:nth-child(5)")?.textContent?.trim() || "",
      Language: e.querySelector("td:nth-child(6)")?.textContent?.trim() || "",
      Pages: e.querySelector("td:nth-child(7)")?.textContent?.trim() || "",
      Size:
        parseInt(
          e.querySelector("td:nth-child(8)")?.textContent?.trim() || "0",
        ) * 1000000,
      Extension: e.querySelector("td:nth-child(9)")?.textContent?.trim() || "",
      md5: (
        e.querySelector("a[href*='md5=']") as HTMLAnchorElement
      )?.href.split("=")?.[1],
    })),
    "",
  ];
}
