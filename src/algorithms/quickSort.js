/**
 * Quick Sort — O(n log n) average time, O(log n) space
 * Yields snapshots at each comparison, swap, and pivot placement.
 */
export async function* quickSort(arr) {
  const a = arr.map((x) => ({ ...x }));
  let swaps = 0;
  let comps = 0;

  async function* helper(lo, hi) {
    if (lo >= hi) {
      if (lo === hi) {
        a[lo].state = "sorted";
        yield { arr: a.map((x) => ({ ...x })), swaps, comps };
      }
      return;
    }

    // Mark pivot
    a[hi].state = "pivot";
    yield { arr: a.map((x) => ({ ...x })), swaps, comps };

    let p = lo;
    for (let j = lo; j < hi; j++) {
      comps++;
      a[j].state = "comparing";
      yield { arr: a.map((x) => ({ ...x })), swaps, comps };

      if (a[j].value < a[hi].value) {
        [a[p], a[j]] = [a[j], a[p]];
        swaps++;
        a[p].state = "swapping";
        a[j].state = "swapping";
        yield { arr: a.map((x) => ({ ...x })), swaps, comps };
        a[p].state = "idle";
        a[j].state = "idle";
        p++;
      } else {
        a[j].state = "idle";
      }
    }

    [a[p], a[hi]] = [a[hi], a[p]];
    swaps++;
    a[p].state = "sorted";
    yield { arr: a.map((x) => ({ ...x })), swaps, comps };

    yield* helper(lo, p - 1);
    yield* helper(p + 1, hi);
  }

  yield* helper(0, a.length - 1);
  yield { arr: a.map((x) => ({ ...x })), swaps, comps, done: true };
}
