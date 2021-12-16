import get from 'just-safe-get';

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
const getFilterFn = <U>($filter: Filter): ((o: U) => boolean) => {
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

export type FilterOptions = {
  filter: Filter;
};
export type FilterSummary = {
  filter: Filter;
};
export type FilterResult<T> = {
  data: T[];
  summary: FilterSummary;
};
export function filterInMemory<T>(
  data: T[],
  opts: FilterOptions
): FilterResult<T> {
  const filteredData = data.filter(getFilterFn(opts.filter));
  return { data: filteredData, summary: opts };
}
