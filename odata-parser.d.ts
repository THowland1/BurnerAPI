declare module 'odata-parser' {
  type Equation<TypeName> = {
    type: TypeName;
    left: Operand;
    right: Operand;
  };
  type Conjunction<TypeName> = {
    type: TypeName;
    left: Filter;
    right: Filter;
  };

  type OneArgFunction<FunctionName> = {
    type: 'functioncall';
    func: FunctionName;
    args: [Operand];
  };
  type TwoArgFunction<FunctionName> = {
    type: 'functioncall';
    func: FunctionName;
    args: [Operand, Operand];
  };
  type ThreeArgFunction<FunctionName> = {
    type: 'functioncall';
    func: FunctionName;
    args: [Operand, Operand, Operand];
  };

  type PropertyOperand = {
    type: 'property';
    name: string;
  };
  type LiteralOperand = {
    type: 'literal';
    value: any;
  };
  type Operand =
    | PropertyOperand
    | LiteralOperand
    | OneArgFunction<
        | 'tolower'
        | 'toupper'
        | 'trim'
        | 'length'
        | 'year'
        | 'month'
        | 'day'
        | 'hour'
        | 'minute'
        | 'second'
        | 'round'
        | 'floor'
        | 'ceiling'
      >
    | TwoArgFunction<'indexof' | 'concat' | 'substring'>
    | ThreeArgFunction<'replace'>;
  //| Equation<'add' | 'sub' | 'mul' | 'div' | 'mod'>; // not supported by odata-parser;

  type Filter =
    | Equation<'eq' | 'lt' | 'gt' | 'le' | 'ge' | 'ne'>
    | Conjunction<'and' | 'or'>
    | OneArgFunction<'IsOf'>
    | TwoArgFunction<'substringof' | 'endswith' | 'startswith'>;

  type ODataParseParams = {
    $filter: Filter;
    $orderby: Record<string, 'asc' | 'desc'>[];
    $select: string[];
    $skip: number;
    $top: number;
    $inlinecount: 'none' | 'allpages';
    $format: string;
  };
  function parse(queryString: string): ODataParseParams;
}
