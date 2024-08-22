import { test } from '@playwright/test';
import { BooleanNumber, ICellData, IWorkbookData, LocaleType } from '@univerjs/core';

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    // @ts-expect-error
    window.createData = (row: number, col: number) => {
      const cellData: ICellData[][] = [];
      for (let i = 0; i < row; i++) {
        const row: ICellData[] = [];
        for (let j = 0; j < col; j++) {
          row.push({
            v: i + ',' + j,
          });
        }
        cellData.push(row);
      }

      const workbookData: IWorkbookData = {
        id: 'workbook-01',
        locale: 'zhCN' as LocaleType,
        name: 'universheet',
        sheetOrder: ['sheet-01', 'sheet-02', 'sheet-03', 'sheet-04', 'sheet-05', 'sheet-06'],
        styles: {
        },
        appVersion: '3.0.0-alpha',
        sheets: {
          'sheet-01': {
            id: 'sheet-01',
            cellData,
            name: 'sheet1',
            tabColor: 'red',
            hidden: 0 as 0 as BooleanNumber.FALSE,
            rowCount: 1000,
            columnCount: 20,
            zoomRatio: 1,
            scrollTop: 200,
            scrollLeft: 100,
            mergeData: [
              {
                startRow: 2,
                endRow: 6,
                startColumn: 5,
                endColumn: 10,
              },
              {
                startRow: 10,
                endRow: 12,
                startColumn: 9,
                endColumn: 12,
              },
              {
                startRow: 10,
                endRow: 12,
                startColumn: 9,
                endColumn: 12,
              },
              {
                startRow: 17,
                endRow: 21,
                startColumn: 3,
                endColumn: 6,
              },
              {
                startRow: 13,
                endRow: 15,
                startColumn: 9,
                endColumn: 10,
              },
              {
                startRow: 24,
                endRow: 27,
                startColumn: 9,
                endColumn: 10,
              },
              {
                startRow: 32,
                endRow: 53,
                startColumn: 3,
                endColumn: 5,
              },
            ],
            rowData: {
              3: {
                h: 50,
                hd: 0 as BooleanNumber.FALSE,
              },
              4: {
                h: 60,
                hd: 0 as BooleanNumber.FALSE,
              },
              29: {
                h: 200,
                hd: 0 as BooleanNumber.FALSE,
              },
            },
            columnData: {
              5: {
                w: 100,
                hd: 0 as BooleanNumber.FALSE,
              },
              6: {
                w: 200,
                hd: 0 as BooleanNumber.FALSE,
              },
              13: {
                w: 300,
                hd: 0 as BooleanNumber.FALSE,
              },
            },
            showGridlines: 1,
            rowHeader: {
              width: 46,
              hidden: 0 as BooleanNumber.FALSE,
            },
            columnHeader: {
              height: 20,
              hidden: 0 as BooleanNumber.FALSE,
            },
            selections: ['A2'],
            rightToLeft: 0 as BooleanNumber.FALSE,
          },
          'sheet-02': {
            id: 'sheet-02',
            name: 'sheet2',
            cellData: {
              0: {
                0: {
                  s: '1',
                  v: 1,
                },
                1: {
                  s: '1',
                  v: 1,
                },
                5: {
                  s: '1',
                  v: 8,
                },
                6: {
                  s: '2',
                  v: 8,
                },
              },
              20: {
                0: {
                  v: 'sheet2',
                },
                1: {
                  v: 'sheet2 - 2',
                },
              },
            },
          },
          'sheet-03': {
            id: 'sheet-03',
            name: 'sheet3',
          },
          'sheet-04': {
            id: 'sheet-04',
            name: 'sheet4',
          },
          'sheet-05': {
            id: 'sheet-05',
            name: 'sheet5',
          },
          'sheet-06': {
            id: 'sheet-06',
            name: 'sheet6',
          },
        },
      };
      return workbookData;
    };
  });
});

const createTest = (row: number, col: number) => {
  test(`raw load ${row}*${col} data`, async ({ page }) => {
    await page.goto('/');

    const jsHandle = await page.evaluateHandle('window');

    await test.step('create data', async () => {
      await page.evaluate(({ row, col, window }: any) => {
        window.data = window.createData(row, col);
      }, { row, col, window: jsHandle });
    })

    try {
      await test.step('timeCost', async () => {
        await page.evaluate((window: any) => {
          window.univer.createUniverSheet(window.data);
        }, jsHandle);
  
        await page.waitForFunction(() => {
          return document.querySelectorAll('canvas')[2]?.getContext('2d')?.getImageData(70, 40, 10, 10).data.find((d: number) => d !== 0);
        });
      })
    } catch (error) {
      console.log('error', error);
    }
  })
};


createTest(10, 100000);
createTest(100, 10000);
createTest(1000, 1000);
createTest(10000, 100);
createTest(100000, 10);

createTest(10, 1000000);
createTest(100, 100000);
createTest(1000, 10000);
createTest(10000, 1000);
createTest(100000, 100);
createTest(1000000, 10);
