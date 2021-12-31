// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'odata-parser';
import { endpoints, toRecId } from '../../../utils/airtable';
import * as Assert from '../../../utils/assert';
import { FilterOptions } from '../../../utils/query/filter-in-memory';
import { PaginationOptions } from '../../../utils/query/paginate-in-memory';
import {
  queryInMemory,
  QueryOptions,
  QuerySummary,
} from '../../../utils/query/query-in-memory';
import { SelectOptions } from '../../../utils/query/select-in-memory';
import { SortOptions } from '../../../utils/query/sort-in-memory';

type AcceptedParams = {
  filter?: string | string[];
  orderby?: string | string[];
  select?: string | string[];
  skip?: string | string[];
  top?: string | string[];
  pagesize?: string | string[];
  pagenumber?: string | string[];
  after?: string | string[];
  pagingtype?: string | string[];
};

function coerceFilterOptions(params: AcceptedParams): FilterOptions {
  if (params.filter) {
    return parse(`$filter=${params.filter}`).$filter;
  } else {
    return null;
  }
}
function coercePaginationOptions(params: AcceptedParams): PaginationOptions {
  const { pagingtype } = params;
  if (!pagingtype) {
    return {
      type: 'offset',
      skip: 0,
      top: 10,
    };
  }
  switch (String(pagingtype)) {
    case 'offset':
      const offsetSkip = Number(params.skip) || 0;
      const offsetTop = Number(params.top) || 10;
      return {
        type: 'offset',
        skip: offsetSkip,
        top: offsetTop,
      };
    case 'cursor':
      const cursorAfter = String(params.after) || null;
      const cursorTop = Number(params.after) || 10;
      return {
        type: 'cursor',
        after: cursorAfter,
        top: cursorTop,
      };
    case 'paging':
      const pagenumber = Number(params.pagenumber) || 0;
      const pagesize = Number(params.pagesize) || 10;
      return {
        type: 'paging',
        page_number: pagenumber,
        page_size: pagesize,
      };

    default:
      throw new Error(`${String(pagingtype)} is not a valid pagingtype`);
  }
}
function coerceSortOptions(params: AcceptedParams): SortOptions {
  if (params.orderby) {
    return parse(`$orderby=${params.orderby}`).$orderby;
  } else {
    return null;
  }
}
function coerceSelectOptions(params: AcceptedParams): SelectOptions {
  if (params.select) {
    return parse(`$select=${params.select}`).$select;
  } else {
    return null;
  }
}

function getQueryParams(params: AcceptedParams): QueryOptions {
  return {
    filtering: coerceFilterOptions(params),
    pagination: coercePaginationOptions(params),
    selecting: coerceSelectOptions(params),
    sorting: coerceSortOptions(params),
  };
}

type SuccessResult<T> = {
  data: T[];
  summary: QuerySummary;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { endpointId } = req.query;
  try {
    Assert.string(
      endpointId,
      `endpointId should be a single string, not an array (${JSON.stringify(
        endpointId
      )})`
    );

    const recId = toRecId(endpointId);
    switch (req.method) {
      case 'GET':
        const existingEndpoint = await endpoints.find(recId);

        const rawData = existingEndpoint.fields.raw;
        const idPropName = existingEndpoint.fields.idPropName as string;

        Assert.string(rawData, 'raw must be a string');
        Assert.string(idPropName, 'idPropName must be a string');

        const idGetter = (item: any) => item[idPropName];

        const data: Array<unknown> = JSON.parse(rawData);
        console.log(req.query);
        const { data: queriedData, summary: querySummary } = queryInMemory(
          data,
          getQueryParams(req.query),
          idGetter
        );

        const successResult: SuccessResult<any> = {
          data: queriedData,
          summary: querySummary,
        };
        res.status(200).json(successResult);
        break;
      case 'PUT':
        const { id: _, ...fields } = JSON.parse(req.body);
        const updatedEndpoint = await endpoints.update([{ id: recId, fields }]);
        res.status(200).json(updatedEndpoint);
        break;
      case 'DELETE':
        const deletedEndpoint = await endpoints.destroy(recId);
        res.status(200).json(deletedEndpoint);
        break;
      default:
        res.status(404);
        break;
    }
  } catch (error) {
    res.status(500).json({ error: 'no' });
  }
}
