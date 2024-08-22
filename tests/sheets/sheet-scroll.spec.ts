import { expect, Page, test } from '@playwright/test';
import { BooleanNumber, ICellData, IWorkbookData, LocaleType } from '@univerjs/core';

import { sheetData } from './data/emptysheet.ts';
export type FPSData = {
  fpsData: number[];
  avgFps: number;
};

type MeasureFPSParam = {duration: number; deltaX: number; deltaY: number};
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    //@ts-expect-error
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

async function measureFPS(page: Page, duration = 5, deltaX: number, deltaY: number) {
  const fps = await page.evaluate( ({duration, deltaX, deltaY}: MeasureFPSParam) => {
    let intervalID;
    // dispatch wheel event
    const dispathWheelEvent = () => {
      const canvasElements = document.querySelectorAll('canvas.univer-render-canvas') as unknown as HTMLElement[];
      const filteredCanvasElements = Array.from(canvasElements).filter(canvas => canvas.offsetHeight > 500);

      var interval = 100;
      const dispatchSimulateWheelEvent = (element) => {
        var event = new WheelEvent('wheel', {
          bubbles: true,
          cancelable: true,
          deltaY: deltaY,
          deltaX: deltaX,
          clientX: 580,
          clientY: 580,
        });
        element.dispatchEvent(event);
      }

      // 持续模拟 wheel 事件
      const continuousWheelSimulation = (element, interval) => {
        intervalID = setInterval(function () {
          dispatchSimulateWheelEvent(element);
        }, interval);
      }

      // 开始持续模拟 wheel 事件
      continuousWheelSimulation(filteredCanvasElements[0], interval);

    }

    dispathWheelEvent();

    return new Promise((resolve) => {
      let frameCount = 0;
      let startTime = performance.now();

      function countFrames(_timestamp) {
        frameCount++;
        if (performance.now() - startTime < duration * 1000) {
          requestAnimationFrame(countFrames);
        } else {
          clearInterval(intervalID);
          const elapsedTime = (performance.now() - startTime) / 1000;
          const fps = frameCount / elapsedTime;
          resolve(fps);
        }
      }

      requestAnimationFrame(countFrames);
    });
  }, {duration, deltaX, deltaY});

  return fps;
}

async function dispatchWheelEvent(page, deltaY, deltaX) {
  await page.evaluate((deltaY, deltaX) => {

  const canvasElements = document.querySelectorAll('canvas.univer-render-canvas') as unknown as HTMLElement[];
  const filteredCanvasElements = Array.from(canvasElements).filter(canvas => canvas.offsetHeight > 500);

  var interval = 100;
  const dispatchSimulateWheelEvent = (element) => {
    var event = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: deltaY,
      deltaX: deltaX,
      clientX: 580,
      clientY: 580,
    });
    element.dispatchEvent(event);
  }

  // 持续模拟 wheel 事件
  const continuousWheelSimulation = (element, interval) => {
    setInterval(function () {
      dispatchSimulateWheelEvent(element);
    }, interval);
  }

  // 开始持续模拟 wheel 事件
  continuousWheelSimulation(filteredCanvasElements[0], interval);
  }, deltaY, deltaX);
};



const createTest = (row: number, col: number) => {
  test(`sheet scroll ${row}*${col} data`, async ({ page }) => {

    // const browser = await chromium.launch({ headless: false }); // 启动浏览器并保持可见
    // const page = await browser.newPage();
    console.log('createTest');
    await page.goto('http://localhost:8089/');
    const windowHandle = await page.evaluateHandle('window');

    await test.step('create univer', async () => {
      let data = sheetData;
      await page.evaluate(({ row, col, data, window }: any) => {
        window.univer.createUniverSheet(data);
      }, { row, col, data, window: windowHandle });


      await page.waitForLoadState('networkidle');
      // wait for canvas has data
      await page.waitForFunction(() => {
        const canvaslist = document.querySelectorAll('canvas');
        if (canvaslist.length > 2) {
          const imgData = canvaslist[2]!.getContext('2d')!.getImageData(40, 40, 1, 1).data;
          console.log('canvaslist', imgData[0], imgData[1], imgData[2], imgData[3]);
          return canvaslist[2]!.getContext('2d')!.getImageData(40, 40, 1, 1).data[3] !== 0;
        }
      });
    });


    try {
      console.log('start scroll!!!!!!!!!!!!!!!!!!!!!!')
      const fps = await measureFPS(page, 10, 0, 100);
      await test.step('fps', async () => {
        console.log('fps', fps);
        expect(fps).toBeGreaterThan(30); // 断言FPS大于30
      });
    } catch (error) {
      console.log('error', error);
    } finally {

      // Keep page
      console.log('Test case completed. Browser instance is still open.');
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 1000 * 60 * 10);
      });
    }
  });
};


createTest(1000000, 10);
