import { test, expect } from '@playwright/test';
import { IObjectMatrixPrimitiveType } from '@univerjs/core';
import { IWorkbookData, LocaleType, ICellData } from '@univerjs/core';
import { FormulaExecutedStateType, ISetFormulaCalculationNotificationMutation, SetFormulaCalculationStartMutation } from '@univerjs/engine-formula';
import {formula20000WithRandomRange}from './data/formula-20000-with-random-range'
import { formula20000WithNestedSelection } from './data/formula-20000-with-nested-selection';
import { formula20000WithVlookup } from './data/formula-20000-with-vlookup';
import { formula20000WithVlookupAllRange } from './data/formula-20000-with-vlookup-all-range';

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
      // @ts-expect-error
      window.createUniver = function createUniver(window:any,cellData:IObjectMatrixPrimitiveType<ICellData>){

        const workbookData: IWorkbookData = {
          id: 'workbook-01',
          locale: 'zhCN' as LocaleType,
          name: 'universheet',
          sheetOrder: ['sheet-01'],
          styles: {
          },
          appVersion: '3.0.0-alpha',
          sheets: {
            'sheet-01': {
              id: 'sheet-01',
              cellData,
              name: 'sheet1',
            },
          },
        };
      
        window.univer.createUniverSheet(workbookData);
        const univerAPI = window.FUniver.newAPI(window.univer);
        window.univerAPI = univerAPI;

      }
      // @ts-expect-error
      window.createCommandListener = function createCommandListener(window:any){

        return new Promise((resolve, reject) => {
          let startExecutionTime = 0;
        
          window.univerAPI.onCommandExecuted((command, options) => {
      
            const params = command.params as ISetFormulaCalculationNotificationMutation;
            if (command.id === 'formula.mutation.set-formula-calculation-start') {
                console.info(`[Formula Calculation Time Benchmark] Formula calculation started`)
                startExecutionTime = performance.now();
            } else if (command.id === 'formula.mutation.set-formula-calculation-notification' && params.stageInfo == null && params.functionsExecutedState === 3) {
                const result = `[Formula Calculation Time Benchmark] Formula calculation succeeded, Total time consumed: ${performance.now() - startExecutionTime
                    } ms`
      
                console.info(result)
                resolve(result)
            }
        })
      
        window.univerAPI.executeCommand(
            'formula.mutation.set-formula-calculation-start',
            {
                commands: [],
                forceCalculation: true,
            },
            {
                onlyLocal: true,
            }
        );
        })
      }
  });
});


const createTest = (cellData: IObjectMatrixPrimitiveType<ICellData>, name: string) => {

  test(`formula calculation time ${name}`, async ({ page }) => {

    // Listen to console events
    page.on('console', consoleMessage => {
      const messageText = consoleMessage.text();
  
      if (messageText.startsWith('[Formula Calculation Time Benchmark]')) {
        console.log(`Handle console ${name}`, messageText);
      }
    });
  
    await page.goto('/');
  
    const jsHandle = await page.evaluateHandle('window');
  
    await page.evaluate(({window,cellData}:any ) => {
      window.createUniver(window,cellData);
    }, {window:jsHandle,cellData});
  
    await page.waitForFunction(() => {
      return document.querySelectorAll('canvas')[2]!.getContext('2d')!.getImageData(70, 40, 1, 1).data[3] !== 0;
    });
  
    await test.step('timeCost', async () => {
      await page.evaluate(async (window:any ) => {
        await window.createCommandListener(window);
      }, jsHandle);
    })
    
  
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Vite/);
  });
  
  
}

createTest(formula20000WithRandomRange,'formula20000WithRandomRange')
createTest(formula20000WithNestedSelection,'formula20000WithNestedSelection')
createTest(formula20000WithVlookup,'formula20000WithVlookup')
createTest(formula20000WithVlookupAllRange(),'formula20000WithVlookupAllRange')