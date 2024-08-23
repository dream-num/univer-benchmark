import { test } from '@playwright/test';
import { sheetData } from './data/emptysheet.ts';

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    //....
  });
});

const createTest = () => {
  test(`sheet keep 10s`, async ({ page }) => {

    // const browser = await chromium.launch({ headless: false }); // 启动浏览器并保持可见
    // const page = await browser.newPage();

    await page.goto('/');
    const windowHandle = await page.evaluateHandle('window');
    await test.step('create univer', async () => {
      await page.evaluate(({ data, window }: any) => {
        console.log('sheetData', data);
      }, { data: sheetData, window: windowHandle });
    });

    try {
      // 执行测试用例
      // ...
    } catch (error) {
      console.error('Test case failed:', error);
    } finally {
      // 测试用例完成后,保留浏览器实例
      console.log('Test case completed. Browser instance is still open.');
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 1000 * 60 * 20);
      });
    }
  });
};


createTest();
