type CursorPaginationOptions = {
  type: 'cursor';
  after: string | null;
  top: number;
};

type OffsetPaginationOptions = {
  type: 'offset';
  skip: number;
  top: number;
};
type PagingPaginationOptions = {
  type: 'paging';
  page_number: number;
  page_size: number;
};

export type PaginationOptions =
  | CursorPaginationOptions
  | OffsetPaginationOptions
  | PagingPaginationOptions;

type CursorPaginationSummary = CursorPaginationOptions & {
  last_cursor: string | null;
  has_next_page: boolean;
};
type CursorPaginationResult<T> = {
  data: T[];
  summary: CursorPaginationSummary;
};

type OffsetPaginationSummary = OffsetPaginationOptions & {
  total_count: number;
};
type OffsetPaginationResult<T> = {
  data: T[];
  summary: OffsetPaginationSummary;
};

type PagingPaginationSummary = PagingPaginationOptions & {
  total_page_count: number;
};
type PagingPaginationResult<T> = {
  data: T[];
  summary: PagingPaginationSummary;
};

type PaginationResult<T> =
  | PagingPaginationResult<T>
  | OffsetPaginationResult<T>
  | CursorPaginationResult<T>;

export type PaginationSummary =
  | PagingPaginationSummary
  | CursorPaginationSummary
  | OffsetPaginationSummary;

export function paginateInMemory<T>(
  data: T[],
  opts: PaginationOptions,
  cursorSelector: (item: T) => string
): PaginationResult<T> {
  switch (opts.type) {
    case 'cursor':
      return paginateWithCursor(data, opts, cursorSelector);
    case 'paging':
      return paginateWithPaging(data, opts);
    case 'offset':
      return paginateWithOffset(data, opts);

    default:
      throw new TypeError('Unsupported Pagination Type');
  }
}

function getLastItem<T>(arr: T[]): T {
  return arr[arr.length - 1];
}

function paginateWithCursor<T>(
  data: T[],
  opts: CursorPaginationOptions,
  cursorSelector: (item: T) => string
): CursorPaginationResult<T> {
  if (data.length === 0) {
    return {
      data,
      summary: {
        ...opts,
        last_cursor: null,
        has_next_page: false,
      },
    };
  }

  let firstIndex = 0;
  if (opts.after) {
    const cursorIndex = data.findIndex(
      (item) => cursorSelector(item) === opts.after
    );

    firstIndex = cursorIndex + 1;
  }

  const paginatedData = data.slice(firstIndex, firstIndex + opts.top);

  const last_cursor = cursorSelector(getLastItem(paginatedData));
  const last_cursor_from_whole_thing = cursorSelector(getLastItem(data));
  const has_next_page = last_cursor !== last_cursor_from_whole_thing;

  return {
    data: paginatedData,
    summary: { ...opts, last_cursor, has_next_page },
  };
}

function paginateWithOffset<T>(
  data: T[],
  opts: OffsetPaginationOptions
): OffsetPaginationResult<T> {
  const paginatedData = data.slice(opts.skip, opts.skip + opts.top);

  const total_count = data.length;

  return {
    data: paginatedData,
    summary: { ...opts, total_count },
  };
}

function paginateWithPaging<T>(
  data: T[],
  opts: PagingPaginationOptions
): PagingPaginationResult<T> {
  const skip = opts.page_size * (opts.page_number - 1);
  const paginatedData = data.slice(skip, skip + opts.page_size);

  let total_page_count;
  if (data.length === 0) {
    total_page_count = 1;
  } else if (data.length % opts.page_size === 0) {
    total_page_count = data.length / opts.page_size - 1;
  } else {
    total_page_count = Math.floor(data.length / opts.page_size);
  }

  return {
    data: paginatedData,
    summary: { ...opts, total_page_count },
  };
}
