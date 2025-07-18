import chalk from "chalk";
import fs from "fs";
import _ from "lodash";
import path from "path";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import t from "@babel/types";
import prettier from "prettier";

const TARGET_PATH = path.resolve(__dirname, "../shared/src/types/controllers");

if (fs.existsSync(TARGET_PATH) && fs.lstatSync(TARGET_PATH).isDirectory()) {
  fs.rmdirSync(TARGET_PATH, { recursive: true });
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
fs.mkdirSync(TARGET_PATH, { recursive: true });

if (!fs.existsSync(TARGET_PATH)) {
  console.error(
    chalk.red("[ERROR]") +
      ` Target path ${TARGET_PATH} does not exist. Please make sure the monorepo is set up correctly.`
  );
  process.exit(1);
}

const allModules = [
  ...fs.readdirSync("./server/src/apps", { withFileTypes: true }),
  ...fs.readdirSync("./server/src/core/lib", { withFileTypes: true }),
];

let indexContent = ``;

for (const module of allModules) {
  const allControllers: Record<string, string[]> = {};
  const moduleName = _.camelCase(module.name);
  const controllerFiles = fs
    .readdirSync(path.resolve(module.parentPath, module.name), {
      withFileTypes: true,
      recursive: true,
    })
    .filter((c) => c.name.endsWith(".controller.ts"));

  let finalResult = `import { z } from "zod/v4";\nimport { SchemaWithPB } from "../collections/schemaWithPB";\n\n`;

  for (const controllerFile of controllerFiles) {
    const fileContent = fs.readFileSync(
      path.resolve(controllerFile.parentPath, controllerFile.name),
      "utf-8"
    );

    const ast = parser.parse(fileContent, {
      sourceType: "module",
      plugins: ["typescript"],
    });

    const controllers: Array<{
      controller: string;
      method: string | null;
      path: string | null;
      description: string | null;
      schema: Record<
        string,
        {
          code: string;
          start: number;
          end: number;
          loc: {
            start: { line: number; column: number };
            end: { line: number; column: number };
          };
        }
      >;
    }> = [];

    traverse(ast, {
      VariableDeclarator(path) {
        if (path.node.id.type !== "Identifier") return;
        const varName = path.node.id.name;

        let expr = path.node.init;
        let schemaCall: any = null;
        let routeCall: any = null;
        let descriptionCall: any = null;
        let chainDepth = 0;
        while (expr) {
          if (
            expr.type === "CallExpression" &&
            expr.callee.type === "MemberExpression" &&
            expr.callee.property.type === "Identifier" &&
            expr.callee.property.name === "schema"
          ) {
            schemaCall = expr;
          }
          if (
            expr.type === "CallExpression" &&
            expr.callee.type === "MemberExpression" &&
            expr.callee.property.type === "Identifier" &&
            expr.callee.property.name === "route"
          ) {
            routeCall = expr;
          }
          if (
            expr.type === "CallExpression" &&
            expr.callee.type === "MemberExpression" &&
            expr.callee.property.type === "Identifier"
          ) {
            if (expr.callee.property.name === "schema") schemaCall = expr;
            if (expr.callee.property.name === "route") routeCall = expr;
            if (expr.callee.property.name === "description")
              descriptionCall = expr;
          }
          if (schemaCall && routeCall && descriptionCall) break;

          if (
            expr.type === "CallExpression" &&
            expr.callee.type === "MemberExpression"
          ) {
            expr = expr.callee.object;
            chainDepth++;
            if (chainDepth > 16) break;
          } else {
            break;
          }
        }

        let fields: Record<
          string,
          { code: string; start: number; end: number; loc: any }
        > = {};

        if (
          !schemaCall ||
          !schemaCall.arguments[0] ||
          schemaCall.arguments[0].type !== "ObjectExpression"
        )
          return;

        const schemaObj = schemaCall.arguments[0];

        for (const prop of schemaObj.properties) {
          if (prop.type === "ObjectProperty") {
            const key =
              prop.key.type === "Identifier" ? prop.key.name : prop.key.value;
            const valueCode = generate(prop.value).code;
            fields[key] = {
              code: valueCode,
              start: prop.value.start,
              end: prop.value.end,
              loc: prop.value.loc,
            };
          }

          const arg = schemaCall.arguments[0];
          if (arg.type === "ObjectExpression") {
            schemaCall.arguments[0] = t.memberExpression(
              t.memberExpression(
                t.identifier(
                  `${_.upperFirst(_.camelCase(moduleName))}ControllersSchemas`
                ),
                t.identifier(
                  _.upperFirst(
                    _.camelCase(
                      controllerFile.name.replace(".controller.ts", "")
                    )
                  )
                )
              ),
              t.identifier(varName)
            );
          }
        }

        let method: string | null = null;
        let pathStr: string | null = null;
        if (
          routeCall &&
          routeCall.arguments &&
          routeCall.arguments.length > 0 &&
          routeCall.arguments[0].type === "StringLiteral"
        ) {
          const value = routeCall.arguments[0].value;
          const firstSpace = value.indexOf(" ");
          if (firstSpace !== -1) {
            method = value.slice(0, firstSpace);
            pathStr = value.slice(firstSpace + 1);
          } else {
            method = value;
            pathStr = "";
          }
        }

        let description: string | null = null;
        if (
          descriptionCall &&
          descriptionCall.arguments &&
          descriptionCall.arguments.length > 0 &&
          descriptionCall.arguments[0].type === "StringLiteral"
        ) {
          description = descriptionCall.arguments[0].value;
        }

        controllers.push({
          controller: varName,
          method,
          path: pathStr,
          description,
          schema: fields,
        });
      },
    });

    const prettifiedOriginal = prettier.format(generate(ast).code, {
      parser: "typescript",
    });

    console.log(
      chalk.blue("[INFO]") +
        ` Found ${controllers.length} controllers in module ${chalk.bold(moduleName)}.`
    );

    finalResult += `const ${_.upperFirst(_.camelCase(controllerFile.name.replace(".controller.ts", "")))} = {\n`;

    for (let controller of controllers) {
      finalResult += `
        /**
         * @route       ${controller.method ? controller.method.toUpperCase() : "UNKNOWN"} ${controller.path || "UNKNOWN"}
         * @description ${controller.description || "No description provided"}
         */
        ${_.camelCase(controller.controller)}: {\n`;
      for (let [field, code] of Object.entries(controller.schema)) {
        finalResult += `   ${field}: ${code.code},\n`;
      }
      finalResult += "},\n";
    }
    finalResult += "};\n\n";

    allControllers[controllerFile.name.replace(".controller.ts", "")] =
      controllers.map((c) => c.controller);
  }

  finalResult +=
    controllerFiles
      .map(
        (f) =>
          `type I${_.upperFirst(_.camelCase(f.name.replace(".controller.ts", "")))} = z.infer<typeof ${_.upperFirst(
            _.camelCase(f.name.replace(".controller.ts", ""))
          )}>;`
      )
      .join("\n") + "\n\n";

  finalResult += `
  export type {
    ${controllerFiles
      .map(
        (f) =>
          `I${_.upperFirst(_.camelCase(f.name.replace(".controller.ts", "")))}`
      )
      .join(", ")}
  };
  `;

  finalResult += `export {
    ${controllerFiles
      .map(
        (f) =>
          `  ${_.upperFirst(_.camelCase(f.name.replace(".controller.ts", "")))}`
      )
      .join(",\n    ")}
  };\n\n`;

  finalResult = finalResult.replaceAll("WithPBSchema", "SchemaWithPB");

  const formatted = await prettier.format(finalResult, {
    parser: "typescript",
  });

  const outputPath = path.join(
    TARGET_PATH,
    `${_.camelCase(moduleName)}.schema.ts`
  );

  fs.writeFileSync(outputPath, formatted);

  indexContent += `export * as ${_.upperFirst(_.camelCase(moduleName))}ControllersSchemas from "./${_.camelCase(
    moduleName
  )}.schema";\n`;
}

fs.writeFileSync(path.join(TARGET_PATH, "index.ts"), indexContent);
