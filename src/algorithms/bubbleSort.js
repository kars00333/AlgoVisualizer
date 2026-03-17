/**
 * Bubble Sort — O(n²) time, O(1) space
 * Yields snapshots of the array at each comparison/swap step.
 */
export async function* bubbleSort(arr) {
  const a = arr.map((x) => ({ ...x }));
  const n = a.length;
  let swaps = 0;
  let comps = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comps++;
      a[j].state = "comparing";
      a[j + 1].state = "comparing";
      yield { arr: a.map((x) => ({ ...x })), swaps, comps };

      if (a[j].value > a[j + 1].value) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        a[j].state = "swapping";
        a[j + 1].state = "swapping";
        yield { arr: a.map((x) => ({ ...x })), swaps, comps };
      }

      a[j].state = "idle";
      a[j + 1].state = "idle";
    }
    a[n - 1 - i].state = "sorted";
    yield { arr: a.map((x) => ({ ...x })), swaps, comps };
  }

  a[0].state = "sorted";
  yield { arr: a.map((x) => ({ ...x })), swaps, comps, done: true };
}
