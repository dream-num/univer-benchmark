import { test } from '@playwright/test';

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
      await page.evaluate(({ row, col, window }: any) => {
        window.data = window.createData(row, col);
        // create univer sheet instance
        window.univer.createUniverSheet({});
        const univerAPI = window.FUniver.newAPI(window.univer);
        window.univerAPI = univerAPI;
      }, { row, col, window: jsHandle });
    })

    await page.waitForTimeout(200);


    await test.step('timeCost', async () => {
      await page.evaluate((window: any) => {
        window.setValues(window.data);
      }, jsHandle);

      await page.waitForFunction(() => {
        return document.querySelectorAll('canvas')[2]?.getContext('2d')?.getImageData(70, 40, 10, 10).data.find((d: number) => d !== 0);
      });
    })
  })
};

createTest(10, 100000);
createTest(100, 10000);
createTest(1000, 1000);
createTest(10000, 100);
createTest(100000, 10);

createTest(10, 1000000);
// createTest(100, 100000);
// createTest(1000, 10000);
// createTest(10000, 1000);
// createTest(100000, 100);
// createTest(1000000, 10);
