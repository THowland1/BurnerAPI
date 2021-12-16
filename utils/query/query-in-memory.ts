import {
  filterInMemory,
  FilterOptions,
  FilterSummary,
} from './filter-in-memory';
import {
  paginateInMemory,
  PaginationOptions,
  PaginationSummary,
} from './paginate-in-memory';
import {
  selectInMemory,
  SelectOptions,
  SelectSummary,
} from './select-in-memory';
import { sortInMemory, SortOptions, SortSummary } from './sort-in-memory';

export type QuerySummary = {
  filtering: FilterSummary;
  selecting: SelectSummary;
  sorting: SortSummary;
  pagination: PaginationSummary;
};
export type QueryOptions = {
  filtering: FilterOptions;
  selecting: SelectOptions;
  sorting: SortOptions;
  pagination: PaginationOptions;
};

export type QueryResult<T> = {
  data: T[];
  summary: QuerySummary;
};

export function queryInMemory<T>(
  data: T[],
  opts: QueryOptions,
  cursorSelector: (item: T) => string
): QueryResult<T> {
  // FILTER
  const { data: dataf, summary: filterSummary } = filterInMemory(
    data,
    opts.filtering
  );

  // SORT
  const { data: datafs, summary: sortSummary } = sortInMemory(
    dataf,
    opts.sorting
  );

  // SELECT
  const { data: datafss, summary: selectSummary } = selectInMemory(
    datafs,
    opts.selecting
  );

  // PAGINATE
  const { data: datafssp, summary: paginationSummary } = paginateInMemory(
    datafss,
    opts.pagination,
    cursorSelector
  );

  return {
    data: datafssp,
    summary: {
      filtering: filterSummary,
      pagination: paginationSummary,
      selecting: selectSummary,
      sorting: sortSummary,
    },
  };
}
