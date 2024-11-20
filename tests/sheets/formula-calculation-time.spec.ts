import { test, expect } from "@playwright/test";
import { IObjectMatrixPrimitiveType } from "@univerjs/core";
import { IWorkbookData, LocaleType, ICellData } from "@univerjs/core";
import { generateVlookup } from "./data/formula-vlookup";
import { generateNestedSelection } from "./data/formula-nested-selection";
import { generateRandomRange } from "./data/formula-random-range";
import { generateNestedSum } from "./data/formula-nested-sum";

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

        window.univer.createUniverSheet(workbookData);
        const univerAPI = window.FUniver.newAPI(window.univer);
        window.univerAPI = univerAPI;

        const formula = univerAPI.getFormula();
        formula.calculationEnd(()=>{
          resolve(null)
        })
      });
    };
  });
});

const createTest = (
  cellData: IObjectMatrixPrimitiveType<ICellData>,
  name: string
) => {
  test(`formula calculation time ${name}`, async ({ page }) => {
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
    await expect(page).toHaveTitle('Benchmarks');

  });
};
const formulaNumber = 20000

createTest(generateRandomRange(formulaNumber),formulaNumber +' formula random range')
createTest(generateVlookup(formulaNumber),formulaNumber +' formula vlookup all range')
createTest(generateNestedSelection(formulaNumber),formulaNumber +' formula nested selection')
createTest(generateNestedSum(formulaNumber),formulaNumber +' formula nested selection')



