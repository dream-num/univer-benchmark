import { test, expect } from "@playwright/test";
import { IObjectMatrixPrimitiveType } from "@univerjs/core";
import { IWorkbookData, LocaleType, ICellData } from "@univerjs/core";
import {
  FormulaExecutedStateType,
  ISetFormulaCalculationNotificationMutation,
  SetFormulaCalculationStartMutation,
} from "@univerjs/engine-formula";
import { formula20000WithRandomRange } from "./data/formula-20000-with-random-range";
import { formula20000WithNestedSelection } from "./data/formula-20000-with-nested-selection";
import { formula20000WithVlookup } from "./data/formula-20000-with-vlookup";
import { formula20000WithVlookupAllRange } from "./data/formula-20000-with-vlookup-all-range";

test.setTimeout(1000 * 60 * 5); // 5 minutes

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    // @ts-expect-error
    window.createUniver = function createUniver(
      window: any,
      cellData: IObjectMatrixPrimitiveType<ICellData>
    ) {
      return new Promise((resolve, reject) => {
        const workbookData: IWorkbookData = {
          id: "workbook-01",
          locale: "zhCN" as LocaleType,
          name: "universheet",
          sheetOrder: ["sheet-01"],
          styles: {},
          appVersion: "3.0.0-alpha",
          sheets: {
            "sheet-01": {
              id: "sheet-01",
              cellData,
              name: "sheet1",
            },
          },
        };

        // Listen for calculation end messages in advance
        window.commandService.onCommandExecuted((command, options) => {
          const params =
            command.params as ISetFormulaCalculationNotificationMutation;
          if (
            command.id ===
              "formula.mutation.set-formula-calculation-notification" &&
            params.stageInfo == null &&
            params.functionsExecutedState === 3
          ) {
            resolve(null);
          }
        });

        window.univer.createUniverSheet(workbookData);
        const univerAPI = window.FUniver.newAPI(window.univer);
        window.univerAPI = univerAPI;
      });
    };
  });
});

const createTest = (
  cellData: IObjectMatrixPrimitiveType<ICellData>,
  name: string
) => {
  test(`formula calculation time ${name}`, async ({ page }) => {
    console.log("create data");
    // Listen to console events
    page.on("console", (consoleMessage) => {
      const messageText = consoleMessage.text();

      if (messageText.startsWith("[Formula Calculation Time Benchmark]")) {
        console.log(`Handle console ${name}`, messageText);
      }
    });

    await page.goto("/");

    const jsHandle = await page.evaluateHandle("window");

    await test.step("timeCost", async () => {
      await page.evaluate(
        async ({ window, cellData }: any) => {
          await window.createUniver(window, cellData);
        },
        { window: jsHandle, cellData }
      );
    });

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Vite/);
  });
};

createTest(formula20000WithRandomRange, "formula20000WithRandomRange");
createTest(formula20000WithNestedSelection,'formula20000WithNestedSelection')
createTest(formula20000WithVlookup,'formula20000WithVlookup')
createTest(formula20000WithVlookupAllRange(),'formula20000WithVlookupAllRange')
