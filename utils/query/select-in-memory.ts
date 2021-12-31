import { deepPick } from '../deep-pick';

export type SelectOptions = string[] | null;
export type SelectSummary = string[] | null;
export type SelectResult<T> = {
  data: T[];
  summary: SelectSummary;
};
export function selectInMemory<T>(
  data: T[],
  opts: SelectOptions
): SelectResult<T> {
  if (opts === null) {
    return { data, summary: opts };
  }
  const selectedData = data.map((arrItem) =>
    deepPick(
      arrItem,
      opts.map((s) => s.replaceAll('/', '.')) as (keyof typeof arrItem)[]
    )
  );
  return { data: selectedData, summary: opts };
}
