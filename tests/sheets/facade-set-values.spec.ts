import { test } from '@playwright/test';
import type { FUniver } from '@univerjs/core';
 
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    // @ts-expect-error
    window.createData = (row: number, col: number) => {
      const data: string[][] = [];
      for (let i = 0; i < row; i++) {
        const row: string[] = [];
        for (let j = 0; j < col; j++) {
          row.push(i + ',' + j);
        }
        data.push(row);
      }
      return data;
    };
  });
});

const createTest = (row: number, col: number) => {
  test(`facade setValues ${row}*${col} data`, async ({ page }) => {
    await page.goto('/');

    const jsHandle = await page.evaluateHandle('window');

    await test.step('create data', async () => {
      await page.evaluate(async ({ row, col, window }: any) => {
        window.data = window.createData(row, col);
        // create univer sheet instance
        window.univer.createUniverSheet({
          id: 'API Data Workbook',
          name: 'API Data Workbook',
          sheetOrder: ['sheet-01'],
          sheets: {
            'sheet-01': {
              cellData: {},
              defaultColumnWidth: 100,
              defaultRowHeight: 25,
              rowCount: row,
              columnCount: col,
            },
          },
        });
        const univerAPI = window.FUniver.newAPI(window.univer);
        window.univerAPI = univerAPI;

        const promise = new Promise((resolve) => {
          (univerAPI as FUniver).getHooks().onRendered(()=>{
            resolve(0);
          })
        });
        await promise;
      }, { row, col, window: jsHandle });
    })



    await test.step('timeCost', async () => {
      await page.evaluate((window: any) => {
        window.setValues(window.data);
      }, jsHandle);

      await page.waitForFunction(() => {
        return document.querySelector('.univer-workbench-container-canvas .univer-render-canvas')?.getContext('2d')?.getImageData(50, 30, 70, 14).data.find((d: number) => d !== 0);
      });
    })

    // await page.waitForTimeout(1000000);

  })
};

createTest(10000, 100);
createTest(100000, 10);