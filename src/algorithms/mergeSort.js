/**
 * Merge Sort — O(n log n) time, O(n) space
 * Yields snapshots of the array at each comparison/placement step.
 */
export async function* mergeSort(arr) {
  const a = arr.map((x) => ({ ...x }));
  let swaps = 0;
  let comps = 0;

  async function* helper(lo, hi) {
    if (hi - lo <= 1) return;

    const mid = Math.floor((lo + hi) / 2);
    yield* helper(lo, mid);
    yield* helper(mid, hi);

    const left  = a.slice(lo, mid).map((x) => ({ ...x }));
    const right = a.slice(mid, hi).map((x) => ({ ...x }));
    let i = 0, j = 0, k = lo;

    while (i < left.length && j < right.length) {
      comps++;
      a[k].state = "comparing";
      yield { arr: a.map((x) => ({ ...x })), swaps, comps };

      if (left[i].value <= right[j].value) {
        a[k] = { ...left[i], state: "swapping" };
        i++;
      } else {
        a[k] = { ...right[j], state: "swapping" };
        j++;
        swaps++;
      }
      yield { arr: a.map((x) => ({ ...x })), swaps, comps };
      a[k].state = "idle";
      k++;
    }

    while (i < left.length)  { a[k] = { ...left[i],  state: "idle" }; i++; k++; }
    while (j < right.length) { a[k] = { ...right[j], state: "idle" }; j++; k++; }

    for (let x = lo; x < hi; x++) a[x].state = "sorted";
    yield { arr: a.map((x) => ({ ...x })), swaps, comps };
  }

  yield* helper(0, a.length);
  yield { arr: a.map((x) => ({ ...x })), swaps, comps, done: true };
}
