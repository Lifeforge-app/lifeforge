export * from "./api/bookDetails";

export * from "./api/search";

export * from "./download/process";

export * from "./utils/parsing";

export const getStatus = async (): Promise<boolean> => {
  const status = await fetch("https://libgen.is/", {
    method: "HEAD",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Connection: "keep-alive",
    },
  });

  return status.ok;
};
