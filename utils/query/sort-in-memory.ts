import { ISortCondition, sortByAll } from '../sort-by-all';
import safeGet from 'just-safe-get';

export type SortOptions = Record<string, 'asc' | 'desc'>[] | null;
export type SortSummary = Record<string, 'asc' | 'desc'>[] | null;
export type SortResult<T> = {
  data: T[];
  summary: SortSummary;
};
export function sortInMemory<T>(data: T[], opts: SortOptions): SortResult<T> {
  if (opts === null) {
    return { data, summary: opts };
  }
  const sortConditions = opts
    .map((o) => Object.entries(o)[0])
    .map<ISortCondition<T>>(([prop, direction]) => ({
      iteratee: (o: T) => safeGet(o, prop),
      direction,
    }));
  const dataSortedByAsc = sortByAll(data, sortConditions);

  return { data: dataSortedByAsc, summary: opts };
}
