import chalk from "chalk";
import { Request, Response } from "express";
import morgan from "morgan";

const m =
  process.env.NODE_ENV !== "test"
    ? morgan((tokens: any, req, res) => {
        return [
          chalk.hex("#34ace0").bold(tokens.method(req, res)),
          chalk.hex("#ffb142").bold(tokens.status(req, res)),
          chalk.hex("#ff5252").bold(tokens.url(req, res)),
          chalk.hex("#2ed573").bold(`${tokens["response-time"](req, res)} ms`),
          chalk.hex("#f78fb3").bold(`@ ${tokens.date(req, res)}`),
          chalk.yellow(tokens["remote-addr"](req, res)),
        ].join(" ");
      })
    : (req: Request, res: Response, next: any) => {
        next();
      };

export default m;
