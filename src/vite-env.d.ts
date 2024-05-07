/// <reference types="vite/client" />

import { FUniver } from "@univerjs/facade";
import { ICommandService, Univer } from "@univerjs/core";

declare global {
  interface Window {
    FUniver: typeof FUniver;
    univer: Univer;
    univerAPI: FUniver;
    commandService: ICommandService;
  }
}
