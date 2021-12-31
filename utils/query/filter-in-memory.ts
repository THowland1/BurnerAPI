import get from 'just-safe-get';
import { Filter, Operand } from 'odata-parser';
import * as Assert from '../assert';

const getOperandValue = <T>(item: T, operand: Operand) => {
  switch (operand.type) {
    case 'literal':
      return operand.value;
    case 'property':
      return get(item, operand.name.replaceAll('/', '.'));
    case 'functioncall':
      const arg0 = getOperandValue(item, operand.args[0]);
      switch (operand.func) {
        // string functions
        case 'tolower':
        case 'toupper':
        case 'trim':
        case 'length':
          Assert.string(arg0, `${operand.func} can only be used on strings`);
          const stringArg0: string = arg0;
          return {
            tolower: () => stringArg0.toLowerCase(),
            toupper: () => stringArg0.toUpperCase(),
            trim: () => stringArg0.trim(),
            length: () => stringArg0.length,
          }[operand.func]();
        // date functions
        case 'year':
        case 'month':
        case 'day':
        case 'hour':
        case 'minute':
        case 'second':
          Assert.stringOrNumber(arg0, `${operand.func} can only be used on strings or numbers`); // prettier-ignore
          const arg0AsDate: Date = new Date(arg0);
          Assert.notNaN(arg0AsDate.valueOf(),`${operand.func} can only be used on valid dates (${arg0} cannot be parsed as a date)`); // prettier-ignore
          return {
            year: () => arg0AsDate.getFullYear(),
            month: () => arg0AsDate.getMonth(),
            day: () => arg0AsDate.getDay(),
            hour: () => arg0AsDate.getHours(),
            minute: () => arg0AsDate.getMinutes(),
            second: () => arg0AsDate.getSeconds(),
          }[operand.func]();
        // number functions
        case 'round':
        case 'floor':
        case 'ceiling':
          Assert.number(arg0, `${operand.func} can only be used on numbers`);
          const numberArg0: number = arg0;
          return {
            round: () => Math.round(numberArg0),
            floor: () => Math.floor(numberArg0),
            ceiling: () => Math.ceil(numberArg0),
          }[operand.func]();
        // string-string functions
        case 'indexof':
        case 'concat':
        case 'substring':
          const arg1 = getOperandValue(item, operand.args[1]);
          Assert.string(arg0, `${operand.func} can only be used on string-string pairs`); // prettier-ignore
          Assert.string(arg1, `${operand.func} can only be used on string-string pairs`); // prettier-ignore
          const stringstringArg0: string = arg0;
          const stringstringArg1: string = arg1;
          return {
            indexof: () => stringstringArg0.indexOf(stringstringArg1),
            concat: () => stringstringArg0.concat(stringstringArg1),
            substring: () => stringstringArg0.concat(stringstringArg1),
          }[operand.func]();
        // string-string-string functions
        case 'replace':
          const arg01 = getOperandValue(item, operand.args[1]);
          const arg02 = getOperandValue(item, operand.args[2]);
          Assert.string(arg0, `${operand.func} can only be used on string-string-string triplets`); // prettier-ignore
          Assert.string(arg01, `${operand.func} can only be used on string-string-string triplets`); // prettier-ignore
          Assert.string(arg02, `${operand.func} can only be used on string-string-string triplets`); // prettier-ignore
          const stringstringstringArg0: string = arg0;
          const stringstringstringArg1: string = arg01;
          const stringstringstringArg2: string = arg02;
          return {
            replace: () =>
              stringstringstringArg0.replaceAll(
                stringstringstringArg1,
                stringstringstringArg2
              ),
          }[operand.func]();

        default:
          throw new Error(`Transform method "${operand}" not supported yet`);
      }

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
          const left = getOperandValue(item, $filter.args[o]!);
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

export type FilterOptions = Filter | null;
export type FilterSummary = Filter | null;
export type FilterResult<T> = {
  data: T[];
  summary: FilterSummary;
};
export function filterInMemory<T>(
  data: T[],
  opts: FilterOptions
): FilterResult<T> {
  if (opts === null) {
    return { data, summary: opts };
  }
  const filteredData = data.filter(getFilterFn(opts));
  return { data: filteredData, summary: opts };
}
