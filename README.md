# univer-benchmark

`CostReporter.ts` is a simple benchmarking tool for the Univer project. It only counts the duration consumed by the steps we focus on.

Run with `--workers=1` to avoid performance impact caused by concurrency.

## How to install

```bash
pnpm install
```

## How to run

run with ui
```bash
pnpm benchmark --ui
```

run once
```bash
pnpm benchmark
```

run n times
```bash
pnpm benchmark --repeat=3
pnpm benchmark --repeat=10
```

run with a regular filter, only run the test with the name contains 'raw load'
```bash
pnpm benchmark -g "raw load"
```

## How to write a new test

```typescript
test(`new test`, async ({ page }) => {
  await page.goto('/');
  // wait for the page to be ready or to Pre work

  // The internal time of the step named 'timeCost' will only be counted
  await test.step('timeCost', async () => {
    // do something    
  })
});
```

## Troubleshooting

- Maybe you need check the `playwright.config.ts` file to see if the `projects` options are suitable for your environment.
- the timeout of the test is set to 10s, you can change it in the `playwright.config.ts` file.

## Reference

- [Writing Playwright tests](https://playwright.dev/docs/intro)