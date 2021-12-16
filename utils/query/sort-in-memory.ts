import { ISortCondition, sortByAll } from '../sort-by-all';
import safeGet from 'just-safe-get';

export type SortOptions = {
  orderby: Record<string, 'asc' | 'desc'>[];
};
export type SortSummary = {
  orderby: Record<string, 'asc' | 'desc'>[];
};
export type SortResult<T> = {
  data: T[];
  summary: SortSummary;
};
export function sortInMemory<T>(data: T[], opts: SortOptions): SortResult<T> {
  const sortConditions = opts.orderby
    .map((o) => Object.entries(o)[0])
    .map<ISortCondition<T>>(([prop, direction]) => ({
      iteratee: (o: T) => safeGet(o, prop),
      direction,
    }));
  const dataSortedByAsc = sortByAll(data, sortConditions);

  return { data, summary: opts };
}
