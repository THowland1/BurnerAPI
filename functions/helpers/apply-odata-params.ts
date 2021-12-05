import parser from 'odata-parser';
import safeGet from 'just-safe-get';
import { ISortCondition, sortByAll } from './sortByAll';
import { deepPick } from './deepPick';
import get from 'just-safe-get';

type ODataParams = {
  $filter: Filter;
  $orderby: Record<string, 'asc' | 'desc'>[];
  $select: string[];
  $skip: number;
  $top: number;
};

type ODataValidate<K extends keyof ODataParams> = <T>(
  data: T[],
  params: Pick<ODataParams, K>
) => void;
type ODataTransform<K extends keyof ODataParams> = <T>(
  data: T[],
  params: Pick<ODataParams, K>
) => T[];

const validateTopAndSkip: ODataValidate<'$top' | '$skip'> = (
  data,
  { $top, $skip }
) => {
  if (typeof $top !== 'number') {
    throw new Error('$top must be a number');
  } else {
    if ($top > 10) {
      throw new Error('$top cannot be larger than 10');
    }
    if ($top <= 0) {
      throw new Error('$top cannot be less than or equal to 0');
    }
  }
  if (typeof $skip !== 'number') {
    throw new Error('$top must be a number');
  }
};
const applyTopAndSkip: ODataTransform<'$top' | '$skip'> = (
  data,
  { $top, $skip }
) => {
  return data.slice($skip, $skip + $top);
};

const validateOrderby: ODataValidate<'$orderby'> = (_, { $orderby }) => {
  if (!Array.isArray($orderby)) {
    throw new Error('$orderby must be an array');
  }
  if (!$orderby.every(($o) => typeof $o === 'object')) {
    throw new Error('$select must be an array of objects');
  }
  if (false) {
    throw new Error(
      '$orderby must only contain keys (shallow or deep) of the object'
    );
  }
  if (false) {
    throw new Error('$orderby must only be asc or desc');
  }
  // TODO - validate against shallow non-prop keys
  // if (has(data[0], $orderby.split(NAVIGATION_DELIMITER))) {
  //   throw new Error('$orderby must only be a key of the object');
  // }
  // TODO - validate against deep non-prop keys
  // if (false) {
  //   throw new Error('$orderby must only be a key of the object');
  // }
};
// TODO  support thenby
const applyOrderby: ODataTransform<'$orderby'> = (data, { $orderby }) => {
  type T = typeof data[0];
  const sortConditions = $orderby
    .map(($o) => Object.entries($o)[0])
    .map<ISortCondition<T>>(([prop, direction]) => ({
      iteratee: (o: T) => safeGet(o, prop),
      direction,
    }));
  const dataSortedByAsc = sortByAll(data, sortConditions);

  return dataSortedByAsc;
};

const validateSelect: ODataValidate<'$select'> = (data, { $select }) => {
  if (!Array.isArray($select)) {
    throw new Error('$select must be an array');
  }
  if (!$select.every(($s) => typeof $s === 'string')) {
    throw new Error('$select must be an array of string');
  }
  if (false) {
    throw new Error('$select must only contain keys of the object');
  }
};
const applySelect: ODataTransform<'$select'> = (data, { $select }) => {
  return data.map((arrItem) =>
    deepPick(
      arrItem,
      $select.map(($s) => $s.replaceAll('/', '.')) as (keyof typeof arrItem)[]
    )
  ) as typeof data;
};

// TODO - Validate $filter
const validateFilter: ODataValidate<'$filter'> = (_, { $filter }) => {
  if (typeof $filter !== 'object') {
    throw new Error('$filter must be an object');
  }
};
const getOperandValue = <T>(item: T, operand: Operand) => {
  switch (operand.type) {
    case 'literal':
      return operand.value;
    case 'property':
      return get(item, operand.name.replaceAll('/', '.'));

    default:
      throw new Error('Could not figure out which value is wanted');
  }
};
const getOperandLabel = <T>(item: T, operand: Operand) => {
  switch (operand.type) {
    case 'literal':
      return operand.value;
    case 'property':
      return `${get(item, operand.name.replaceAll('/', '.'))} (${
        operand.name
      })`;

    default:
      throw new Error('Could not figure out which value is wanted');
  }
};
const getFilterFn = ($filter: Filter) => {
  switch ($filter.type) {
    case 'eq':
      return <T>(o: T) =>
        getOperandValue(o, $filter.left) === getOperandValue(o, $filter.right);
    case 'ne':
      return <T>(o: T) =>
        getOperandValue(o, $filter.left) !== getOperandValue(o, $filter.right);
    case 'lt':
      return <T>(o: T) =>
        getOperandValue(o, $filter.left) < getOperandValue(o, $filter.right);
    case 'le':
      return <T>(o: T) =>
        getOperandValue(o, $filter.left) <= getOperandValue(o, $filter.right);
    case 'gt':
      return <T>(o: T) =>
        getOperandValue(o, $filter.left) > getOperandValue(o, $filter.right);
    case 'ge':
      return <T>(o: T) =>
        getOperandValue(o, $filter.left) >= getOperandValue(o, $filter.right);
    case 'functioncall':
      const validateAndGetOperand = (o: 0 | 1) => {
        return <T>(item: T) => {
          const left = getOperandValue(item, $filter.args[o]);
          if (typeof left !== 'string') {
            throw new Error(
              `Filter method "${
                $filter.func
              }" only works with strings. ${getOperandLabel(
                o,
                $filter.args[0]
              )} is not a string`
            );
          }
          return left;
        };
      };

      switch ($filter.func) {
        case 'startswith':
          return <T>(o: T) => {
            const left = validateAndGetOperand(0)(o);
            const right = validateAndGetOperand(1)(o);
            return left.startsWith(right);
          };
        case 'endswith':
          return <T>(o: T) => {
            const left = validateAndGetOperand(0)(o);
            const right = validateAndGetOperand(1)(o);
            return left.endsWith(right);
          };
        case 'substringof':
          return <T>(o: T) => {
            const left = validateAndGetOperand(0)(o);
            const right = validateAndGetOperand(1)(o);
            return right.includes(left);
          };

        default:
          throw new Error(
            `Filter method "${($filter as any).func}" not supported yet`
          );
      }

    case 'and':
      return <T>(o: T) =>
        getFilterFn($filter.left)(o) && getFilterFn($filter.right)(o);
    case 'or':
      return <T>(o: T) =>
        getFilterFn($filter.left)(o) || getFilterFn($filter.right)(o);
    default:
      throw new Error(
        `Filter method "${($filter as any).type}" not supported yet`
      );
  }
};
// TODO - Support $filter
const applyFilter: ODataTransform<'$filter'> = (data, { $filter }) => {
  return data.filter(getFilterFn($filter));
};

function parseODataQueryString(odataQueryString: string) {
  const defaults: Partial<ODataParams> = {
    $skip: 0,
    $top: 10,
  };
  // TODO remove non-OData params
  const parsed: Partial<ODataParams> = odataQueryString
    ? parser.parse(odataQueryString)
    : {};

  console.log(parsed);

  return { ...defaults, ...parsed };
}

export function applyODataParams<T>(data: T[], odataQueryString: string) {
  const { $filter, $orderby, $select, $skip, $top } =
    parseODataQueryString(odataQueryString);
  let res = [...data];

  if ($orderby !== undefined) {
    validateOrderby(res, { $orderby });
    res = applyOrderby(res, { $orderby });
  }

  if ($select !== undefined) {
    validateSelect(res, { $select });
    res = applySelect(res, { $select });
  }

  if ($filter !== undefined) {
    validateFilter(res, { $filter });
    res = applyFilter(res, { $filter });
  }

  if ($skip !== undefined && $top !== undefined) {
    validateTopAndSkip(res, { $skip, $top });
    res = applyTopAndSkip(res, { $skip, $top });
  }

  return res;
}

type PropertyOperand = {
  type: 'property';
  name: string;
};
type LiteralOperand = {
  type: 'literal';
  value: any;
};
type Operand = PropertyOperand | LiteralOperand;

type EQFilter = {
  type: 'eq';
  left: Operand;
  right: Operand;
};
type LTFilter = {
  type: 'lt';
  left: Operand;
  right: Operand;
};
type GTFilter = {
  type: 'gt';
  left: Operand;
  right: Operand;
};
type LEFilter = {
  type: 'le';
  left: Operand;
  right: Operand;
};
type GEFilter = {
  type: 'ge';
  left: Operand;
  right: Operand;
};
type NEFilter = {
  type: 'ne';
  left: Operand;
  right: Operand;
};
type SubstringofFilter = {
  type: 'functioncall';
  func: 'substringof';
  args: [Operand, Operand];
};
type StartswithFilter = {
  type: 'functioncall';
  func: 'startswith';
  args: [Operand, Operand];
};
type EndswithFilter = {
  type: 'functioncall';
  func: 'endswith';
  args: [Operand, Operand];
};
type AndFilter = {
  type: 'and';
  left: Filter;
  right: Filter;
};
type OrFilter = {
  type: 'or';
  left: Filter;
  right: Filter;
};
type Filter =
  | EQFilter
  | LTFilter
  | GTFilter
  | LEFilter
  | GEFilter
  | NEFilter
  | SubstringofFilter
  | AndFilter
  | OrFilter
  | StartswithFilter
  | EndswithFilter;
