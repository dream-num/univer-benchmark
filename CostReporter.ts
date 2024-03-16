import type {
  FullConfig, FullResult, Reporter, Suite, TestCase, TestResult
} from '@playwright/test/reporter';


/**
 * Only calculate the time it takes for the title to be "timeCost"
 */
class CostReporter implements Reporter {

  timer: Record<string, number[]> = {};
  onBegin (config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  onTestBegin (test: TestCase, result: TestResult) {
    console.log(`Starting test ${test.title}`);
  }

  onTestEnd (test: TestCase, result: TestResult) {
    if (!this.timer[test.title]) {
      this.timer[test.title] = []
    }

    if (result.status === 'timedOut') {
      console.error(`Test ${test.title} timed out`);
      this.timer[test.title].push(0);
      return;
    }

    const renderTime = result.steps.find(it => it.title === 'timeCost')?.duration || 0;
    this.timer[test.title].push(renderTime);

    console.log(`Finished test ${test.title}: ${result.status}, duration: ${result.duration}, renderTime: ${renderTime}`);
  }

  onEnd (result: FullResult) {
    console.log('\n');
    console.log(`Finished the run: ${result.status}`);
    console.log('Here are the results:');
    Object.keys(this.timer).forEach((key) => {
      const validData = this.timer[key].filter(it => it > 0);
      const avg = validData.reduce((a, b) => a + b, 0) / validData.length;
      if (validData.length === 0) {
        console.error(`Test [${key}] timed out`);
      } else {
        console.log(`Test [${key}] avg time: ${avg.toFixed(0)}`, this.timer[key])
      }
    });

    // Exit with non-zero code if there are failing tests
    process.exit(0);
  }
}

export default CostReporter;