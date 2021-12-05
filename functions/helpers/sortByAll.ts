// Loving copied from https://github.com/angus-c/just/blob/master/packages/array-sort-by/index.js and modified
type IIteratee<T> = string | ((val: T) => any);
export type ISortCondition<T> = {
  iteratee: IIteratee<T>;
  direction: 'asc' | 'desc';
};

function handleSort<T>(
  sortConditions: ISortCondition<T>[]
): (a: T, b: T) => number {
  return function (a, b) {
    let overallComparisonNumber = 0;

    sortConditions
      .slice()
      .reverse()
      .forEach(({ iteratee, direction }, index) => {
        var keyA = typeof iteratee === 'string' ? a[iteratee] : iteratee(a);
        var keyB = typeof iteratee === 'string' ? b[iteratee] : iteratee(b);

        if (typeof keyA === 'string' && typeof keyB === 'string') {
          keyA = keyA.toUpperCase();
          keyB = keyB.toUpperCase();
        }

        let comparisonNumber = 0;
        if (keyA < keyB) {
          comparisonNumber = -1;
        } else if (keyA > keyB) {
          comparisonNumber = +1;
        }
        const hierarchyMultiplier = (index + 1) * 3;
        overallComparisonNumber +=
          (direction === 'asc' ? 1 : -1) *
          comparisonNumber *
          hierarchyMultiplier;
      });

    return overallComparisonNumber;
  };
}

export function sortByAll<T>(
  arr: T[],
  sortConditions: ISortCondition<T>[]
): T[] {
  if (!Array.isArray(arr)) {
    throw new Error('arr should be an array');
  }

  if (arr.length <= 1) {
    return arr;
  }

  var copied = arr.slice();

  return copied.sort(handleSort(sortConditions));
}
