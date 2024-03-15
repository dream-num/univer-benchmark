import { test } from '@playwright/test';

test('load 1000*1000 data', async ({ page }) => {
  await page.goto('/');

  const jsHandle = await page.evaluateHandle('window');

  await page.evaluate((window: any) => {
    const createData = (row: number, col: number) => {
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
    const data = createData(1000, 1000);
    window.data = data;
  }, jsHandle);

  const time = new Date().getTime();

  await page.evaluate((window: any) => {
    window.setValues(window.data);
  }, jsHandle);

  await page.waitForFunction(() => {
    return document.querySelectorAll('canvas')[2].getContext('2d').getImageData(70, 40, 2, 2).data.find((v) => v !== 0) !== undefined;
  });

  const endTime = new Date().getTime();

  console.log('render time:', endTime - time);
});

