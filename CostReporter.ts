import type {
  FullConfig, FullResult, Reporter, Suite, TestCase, TestResult
} from '@playwright/test/reporter';
import si from 'systeminformation';

async function getSystemInfo () {
  try {
    const cpuInfo = await si.cpu();
    const osInfo = await si.osInfo();
    const memInfo = await si.mem();

    console.log('CPU:', cpuInfo.manufacturer, cpuInfo.brand);
    console.log('OS:', osInfo.distro, osInfo.release);
    console.log('Memory:', Math.round(memInfo.total / (1024 * 1024 * 1024)) + 'GB');
  } catch (error) {
    console.error('Error getting system info:', error);
  }
}

/**
 * Only calculate the time it takes for the title to be "timeCost"
 */
class CostReporter implements Reporter {

  timer: Record<string, number[]> = {};
  projects :string[] = [];
  
  onBegin (config: FullConfig, suite: Suite) {
    this.projects = config.projects.map(it => it.name);
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

    const timeCost = result.steps.find(it => it.title === 'timeCost')?.duration || 0;
    this.timer[test.title].push(timeCost);

    console.log(`Finished test ${test.title}: ${result.status}, duration: ${result.duration}, timeCost: ${timeCost}`);
  }

  async onEnd (result: FullResult) {
    
    console.log(`Finished the run: ${result.status}`);
    console.log('\n --- Here are the results: --- \n');
    console.log(`StartTime: ${result.startTime.toLocaleString("en-US", {timeZone: "Asia/Shanghai"})}`);
    console.log(`Duration: ${result.duration} ms`);
    await getSystemInfo();
    console.log('projects:', this.projects.join(', '));

    Object.keys(this.timer).forEach((key) => {
      const validData = this.timer[key].filter(it => it > 0);
      const avg = validData.reduce((a, b) => a + b, 0) / validData.length;
      if (validData.length === 0) {
        console.error(`Test [${key}] timed out`);
      } else {
        console.log(`Test [${key}] avg time: ${avg.toFixed(0)}ms`, this.timer[key])
      }
    });

    // Exit with non-zero code if there are failing tests
    process.exit(0);
  }
}

export default CostReporter;