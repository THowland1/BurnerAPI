import get from 'just-safe-get';
import set from 'just-safe-set';

// Loving copied from https://github.com/angus-c/just/blob/master/packages/array-sort-by/index.js and modified
export function deepPick<T, U extends keyof T>(obj: T, select: U[]) {
  var result = {} as Pick<T, U>;
  if (typeof select === 'string') {
    select = [].slice.call(arguments, 1);
  }
  select.forEach((selectKey: any) => {
    set(result, selectKey, get(obj, selectKey));
  });

  return result;
}
