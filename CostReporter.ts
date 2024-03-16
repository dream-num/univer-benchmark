import type {
    FullConfig, FullResult, Reporter, Suite, TestCase, TestResult
  } from '@playwright/test/reporter';
  

  /**
   * Only calculate the time it takes for the title to be "timeCost"
   */
  class CostReporter implements Reporter {

    timer:Record<string, number[]> = {};
    onBegin(config: FullConfig, suite: Suite) {
      console.log(`Starting the run with ${suite.allTests().length} tests`);
    }
  
    onTestBegin(test: TestCase, result: TestResult) {
      console.log(`Starting test ${test.title}`);
    }
  
    onTestEnd(test: TestCase, result: TestResult) {
      if(!this.timer[test.title]){
        this.timer[test.title] = []
      }

      const renderTime = result.steps.find(it=>it.title === 'timeCost')?.duration || 0;
      this.timer[test.title].push(renderTime);
      
      console.log(`Finished test ${test.title}: ${result.status}, duration: ${result.duration}, renderTime: ${renderTime}`);
    }
  
    onEnd(result: FullResult) {
      Object.keys(this.timer).forEach((key)=>{
        const avg = this.timer[key].reduce((a,b)=>a+b,0)/this.timer[key].length
        console.log(`Test [${key}] avg time: ${avg.toFixed(0)}`, this.timer[key])
      });
      console.log(`Finished the run: ${result.status}`);
    }
  }
  
  export default CostReporter;