import ClientError from "@functions/ClientError";
import fs from "fs";

import { ALLOWED_LANG, ALLOWED_NAMESPACE } from "../../../constants/locales";

export const getLocales = async (
  lang: (typeof ALLOWED_LANG)[number],
  namespace: (typeof ALLOWED_NAMESPACE)[number],
  subnamespace: string,
): Promise<any> => {
  const finalLang = lang === "zh" ? "zh-CN" : lang;

  let data;

  if (namespace === "apps") {
    if (!fs.existsSync(`${process.cwd()}/src/apps/${subnamespace}/locales`)) {
      throw new ClientError(
        `Subnamespace ${subnamespace} does not exist in apps`,
        404,
      );
    }

    data = JSON.parse(
      fs.readFileSync(
        `${process.cwd()}/src/apps/${subnamespace}/locales/${finalLang}.json`,
        "utf-8",
      ),
    );
  } else {
    if (
      !fs.existsSync(
        `${process.cwd()}/src/core/locales/${finalLang}/${namespace}/${subnamespace}.json`,
      )
    ) {
      throw new ClientError(
        `Subnamespace ${subnamespace} does not exist in namespace ${namespace}`,
        404,
      );
    }

    data = JSON.parse(
      fs.readFileSync(
        `${process.cwd()}/src/core/locales/${finalLang}/${namespace}/${subnamespace}.json`,
        "utf-8",
      ),
    );
  }

  if (namespace === "common" && subnamespace === "sidebar") {
    const moduleLocales = Object.fromEntries(
      fs
        .readdirSync(`${process.cwd()}/src/apps`)
        .filter((module) =>
          fs.existsSync(
            `${process.cwd()}/src/apps/${module}/locales/${finalLang}.json`,
          ),
        )
        .map((module) => {
          const data = JSON.parse(
            fs.readFileSync(
              `${process.cwd()}/src/apps/${module}/locales/${finalLang}.json`,
              "utf-8",
            ),
          );

          return [
            module.replace(".json", ""),
            {
              title: data.title ?? "",
              subsections: data.subsections ?? {},
            },
          ];
        }),
    );

    const coreLocales = Object.fromEntries(
      fs
        .readdirSync(`${process.cwd()}/src/core/locales/${finalLang}/core`)
        .map((file) => {
          const data = JSON.parse(
            fs.readFileSync(
              `${process.cwd()}/src/core/locales/${finalLang}/core/${file}`,
              "utf-8",
            ),
          );

          return [
            file.replace(".json", ""),
            {
              title: data.title ?? "",
              subsections: data.subsections ?? {},
            },
          ];
        }),
    );

    data.apps = {
      ...moduleLocales,
      ...coreLocales,
    };
  }

  return data;
};
