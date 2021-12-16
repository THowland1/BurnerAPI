import { deepPick } from '../deep-pick';

export type SelectOptions = {
  select: string[];
};
export type SelectSummary = {
  select: string[];
};
export type SelectResult<T> = {
  data: T[];
  summary: SelectSummary;
};
export function selectInMemory<T>(
  data: T[],
  opts: SelectOptions
): SelectResult<T> {
  const selectedData = data.map((arrItem) =>
    deepPick(
      arrItem,
      opts.select.map((s) => s.replaceAll('/', '.')) as (keyof typeof arrItem)[]
    )
  );
  return { data: selectedData, summary: opts };
}
