import {
  Autocomplete,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Theme,
  useTheme,
  Chip,
  ChipTypeMap,
} from '@mui/material';
import { Field, FieldArray, Form, Formik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import * as yup from 'yup';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { JSONSchema4 } from 'json-schema';
import {
  AddOutlined,
  ContentPasteTwoTone,
  FilterAltOutlined,
  FilterListOutlined,
  MenuBookOutlined,
  SortOutlined,
} from '@mui/icons-material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

type Modify<T, R> = Omit<T, keyof R> & R;

const UNSET = 'select';
const PAGINGTYPE_OPTIONS = ['offset', 'cursor'];
const DEFAULT_SKIP = 0;
const DEFAULT_TOP = 10;

function urlSearchParamsFromObject(entries: Record<string, any>) {
  const result = new URLSearchParams();
  Object.entries(entries).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => result.append(key, v));
    } else {
      result.append(key, value);
    }
  });
  return result;
}

function useToggleState<TOptions>(
  initialState: TOptions | null
): [TOptions | null, (value: TOptions) => void] {
  const [value, setValue] = useState<TOptions | null>(initialState);
  const toggleValue = (toggledValue: TOptions) => {
    if (toggledValue === value) {
      setValue(null);
    } else {
      setValue(toggledValue);
    }
  };
  return [value, toggleValue];
}

function getPropsFromObjectSchema(schema: JSONSchema4): { path: string[] }[] {
  const properties = schema.properties || {};
  const properties2 = Object.entries(properties)
    .filter(
      ([a, b]) =>
        b.type === 'boolean' ||
        b.type === 'integer' ||
        b.type === 'null' ||
        b.type === 'number' ||
        b.type === 'string' ||
        (b.type === 'object' && !!b.properties)
    )
    .map(([a, b]) => {
      if (
        b.type === 'boolean' ||
        b.type === 'integer' ||
        b.type === 'null' ||
        b.type === 'number' ||
        b.type === 'string'
      ) {
        return [{ path: [a] }];
      } else if (b.type === 'object' && !!b.properties) {
        const ffff = getPropsFromObjectSchema(b);
        return ffff.map(({ path }) => {
          return { path: [a, ...path] };
        });
      } else {
        throw new TypeError(
          'only boolean, integer, null, number, string, and objects with properties allowed'
        );
      }
    });

  return properties2.flat();
}

const validationSchema = yup.object({
  filter: yup.string(),
  pagingtype: yup.string().oneOf<string>(PAGINGTYPE_OPTIONS),
  orderby: yup
    .array()
    .of(
      yup
        .object({
          by: yup.string().required(),
          dir: yup.string().oneOf(['asc', 'desc']),
        })
        .required()
    )
    .required(),
  select: yup.array().of(yup.string().required()).required(),
  skip: yup.number(),
  top: yup.number(),
  after: yup.string(),
});

type Schema = Modify<
  yup.InferType<typeof validationSchema>,
  { pagingtype: 'offset' | 'cursor' | undefined }
>;

const initialValues: Schema = {
  filter: undefined,
  pagingtype: undefined,
  orderby: [],
  select: [],
  skip: undefined,
  top: undefined,
  after: undefined,
};

type QueryParams = {
  filter: string;
  pagingtype: 'offset' | 'cursor';
  orderby: string[];
  select: string[];
  skip: number;
  top: number;
  after: string;
};

const isFilterDirty = (values: Schema) => Boolean(values.filter);
const getFilterSummary = (values: Schema) =>
  isFilterDirty(values) ? 'Filter active' : 'No filter';

const isSelectDirty = (values: Schema) => values.select.length > 0;
const getSelectSummary = (values: Schema) =>
  isSelectDirty(values) ? values.select.join(', ') : 'All properties';

const isSortingDirty = (values: Schema) => values.orderby.length > 0;
const getSortingSummary = (values: Schema) =>
  isSortingDirty(values)
    ? values.orderby
        .map((ob) => `By ${ob.by}${ob.dir === 'desc' ? ' (desc)' : ''}`)
        .join(', ')
    : 'Original order';

const isPagingDirty = (values: Schema) =>
  !(
    values.pagingtype === undefined &&
    values.skip === undefined &&
    values.top === undefined &&
    values.after === undefined
  );
const getPagingSummary = (values: Schema) => {
  let result = `First ${values.top ?? DEFAULT_TOP}`;
  if (values.pagingtype === 'offset' && typeof values.skip === 'number') {
    result += `, skipping ${values.skip}`;
  }
  if (values.pagingtype === 'cursor' && typeof values.after === 'string') {
    result += `, after ${values.after}`;
  }
  return result;
};

const getQueryParamsString = (values: Schema): string => {
  const withUndefineds: Partial<QueryParams> = {
    filter: values.filter,
    pagingtype: values.pagingtype,
    orderby: values.orderby.map(
      (ob) => `${ob.by}${ob.dir ? ' ' + ob.dir : ''}`
    ),
    select: values.select,
    top: values.pagingtype !== undefined ? values.top : undefined,
    skip: values.pagingtype === 'offset' ? values.skip : undefined,
    after: values.pagingtype === 'cursor' ? values.after : undefined,
  };

  const definedEntries = Object.entries(withUndefineds).filter(
    ([_, value]) =>
      !(
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      )
  );
  const onlyDefinedQueryParams = Object.fromEntries(definedEntries);
  const urlSearchParams = urlSearchParamsFromObject(onlyDefinedQueryParams);

  return urlSearchParams.toString();
};

const ParamsForm: FC<{ schema: JSONSchema4 }> = ({ schema }) => {
  const theme = useTheme<Required<Theme>>();

  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [openedQueryForm, toggleOpenedQueryForm] = useToggleState<
    'filtering' | 'sorting' | 'selecting' | 'paging'
  >(null);

  useEffect(() => {
    if (!!schema.items && !Array.isArray(schema.items)) {
      setSelectOptions(
        getPropsFromObjectSchema(schema.items).map((o) => o.path.join('/'))
      );
    } else {
      setSelectOptions([]);
    }
  }, [schema]);

  type QueryFormChipExtraProps = {
    queryForm: 'filtering' | 'sorting' | 'selecting' | 'paging';
    isDirty: boolean;
  };
  const QueryFormChip: OverridableComponent<
    ChipTypeMap<QueryFormChipExtraProps>
  > = ({ ...props }) => {
    const { queryForm, isDirty } = props as QueryFormChipExtraProps;
    return (
      <Chip
        {...props}
        variant={'outlined'}
        sx={{
          position: 'relative',
          backgroundColor: isDirty ? theme.palette.grey[300] : '',
          '&::after':
            openedQueryForm === queryForm
              ? {
                  content: "' '",
                  backgroundColor: theme.palette.grey[500],
                  position: 'absolute',
                  height: '.6rem',
                  width: '1px',
                  top: '100%',
                }
              : undefined,
        }}
        onClick={() => toggleOpenedQueryForm(queryForm)}
        color={'default'}
      />
    );
  };

  return (
    <>
      <Formik
        onSubmit={() => {}}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form>
            <pre>
              <code>{JSON.stringify(values, null, 2)}</code>
            </pre>
            <pre>
              <code>{getQueryParamsString(values) || '.'}</code>
            </pre>
            <Grid sx={{ display: 'flex', gap: '.5rem' }}>
              <QueryFormChip
                queryForm='filtering'
                isDirty={isFilterDirty(values)}
                icon={<FilterAltOutlined />}
                label={<>{getFilterSummary(values)}</>}
              />
              <QueryFormChip
                queryForm='selecting'
                isDirty={isSelectDirty(values)}
                icon={<FilterListOutlined />}
                label={<>{getSelectSummary(values)}</>}
              />
              <QueryFormChip
                queryForm='sorting'
                isDirty={isSortingDirty(values)}
                icon={<SortOutlined />}
                label={<>{getSortingSummary(values)}</>}
              />
              <QueryFormChip
                queryForm='paging'
                isDirty={isPagingDirty(values)}
                icon={<MenuBookOutlined />}
                label={<>{getPagingSummary(values)}</>}
              />
            </Grid>
            <Grid
              sx={{
                padding: '1rem',
                borderRadius: '.25rem',
                marginTop: '.5rem',
                backgroundColor: theme.palette.background.paper,
                // border: `solid 1px ${theme.palette.grey[500]}`,
                boxShadow:
                  'inset 0px 1px 2px 0px rgb(0 0 0 / 14%), inset 0px 1px 5px 0px rgb(0 0 0 / 12%)',
                display: openedQueryForm ? 'block' : 'none',
              }}
            >
              {openedQueryForm === 'filtering' && (
                <>
                  <Typography
                    variant='body1'
                    color={theme.palette.text.disabled}
                  >
                    Filter
                  </Typography>
                  <Field
                    name='filter'
                    as={TextField}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.filter}
                    placeholder='No filter'
                  ></Field>
                </>
              )}
              {openedQueryForm === 'selecting' && (
                <>
                  <Typography
                    variant='body1'
                    color={theme.palette.text.disabled}
                  >
                    Select
                  </Typography>
                  <Field
                    name='select'
                    label='select'
                    onChange={(_: any, value: string[]) =>
                      setFieldValue('select', value)
                    }
                    onBlur={handleBlur}
                    value={values.select}
                    as={(props: any) => (
                      <Autocomplete
                        {...props}
                        multiple
                        disableCloseOnSelect
                        renderInput={(p) => (
                          <TextField
                            {...p}
                            placeholder={
                              values.select.length
                                ? 'Click to add more properties...'
                                : 'All properties'
                            }
                          />
                        )}
                        options={selectOptions}
                        renderOption={(p, option: string, { selected }) => (
                          <li {...p}>
                            <Checkbox
                              icon={
                                <CheckBoxOutlineBlankIcon fontSize='small' />
                              }
                              checkedIcon={<CheckBoxIcon fontSize='small' />}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option}
                          </li>
                        )}
                      />
                    )}
                  ></Field>
                </>
              )}
              {openedQueryForm === 'sorting' && (
                <>
                  <Typography
                    variant='body1'
                    color={theme.palette.text.disabled}
                  >
                    Order by
                  </Typography>
                  <FieldArray name='orderby'>
                    {(arrayHelpers) => (
                      <Grid
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '.5rem',
                        }}
                      >
                        {values.orderby.map((value, index) => (
                          <div key={index}>
                            <Grid sx={{ display: 'flex', gap: '2rem' }}>
                              <Grid sx={{ flex: 1 }}>
                                <Field
                                  name={`orderby.${index}.by`}
                                  label='by'
                                  onChange={(_: any, value: string[]) =>
                                    setFieldValue(`orderby.${index}.by`, value)
                                  }
                                  onBlur={handleBlur}
                                  value={value.by}
                                  as={(props: any) => (
                                    <Autocomplete
                                      {...props}
                                      renderInput={(p) => <TextField {...p} />}
                                      options={selectOptions}
                                    />
                                  )}
                                ></Field>
                              </Grid>

                              <Grid sx={{ margin: 'auto' }}>
                                <Field
                                  name={`orderby.${index}.dir`}
                                  label='dir'
                                  onChange={(_: any, value: string[]) => {
                                    setFieldValue(
                                      `orderby.${index}.dir`,
                                      value
                                    );
                                  }}
                                  onBlur={handleBlur}
                                  value={value.dir}
                                  as={(props: any) => (
                                    <ToggleButtonGroup
                                      {...props}
                                      color='primary'
                                      exclusive
                                    >
                                      <ToggleButton value='asc'>
                                        asc
                                      </ToggleButton>
                                      <ToggleButton value='desc'>
                                        desc
                                      </ToggleButton>
                                    </ToggleButtonGroup>
                                  )}
                                ></Field>
                              </Grid>
                              <Grid sx={{ margin: 'auto' }}>
                                <Button
                                  variant='outlined'
                                  color='secondary'
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  -
                                </Button>
                              </Grid>
                            </Grid>
                          </div>
                        ))}
                        <Button
                          variant='outlined'
                          color='secondary'
                          onClick={() =>
                            arrayHelpers.push({
                              by: '',
                              dir: undefined,
                            } as Schema['orderby'][0])
                          }
                          startIcon={<AddOutlined />}
                        >
                          Add condition
                        </Button>
                      </Grid>
                    )}
                  </FieldArray>
                </>
              )}
              {openedQueryForm === 'paging' && (
                <>
                  <Typography
                    variant='body1'
                    color={theme.palette.text.disabled}
                  >
                    Paging type
                  </Typography>
                  <Field
                    name='pagingtype'
                    onChange={(_: any, value: 'offset' | 'cursor' | null) => {
                      setFieldValue(`pagingtype`, value ?? undefined);
                    }}
                    onBlur={handleBlur}
                    value={values.pagingtype}
                    as={(props: any) => (
                      <>
                        <ToggleButtonGroup {...props} color='primary' exclusive>
                          {PAGINGTYPE_OPTIONS.map((option) => (
                            <ToggleButton key={option} value={option}>
                              {option}
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                      </>
                    )}
                  ></Field>
                  {(values.pagingtype === 'offset' ||
                    values.pagingtype === 'cursor') && (
                    <>
                      <Typography
                        variant='body1'
                        color={theme.palette.text.disabled}
                      >
                        Top
                      </Typography>
                      <Field
                        name='top'
                        type='number'
                        as={TextField}
                        onChange={(e: React.ChangeEvent<number | ''>) => {
                          const value = e.target.value;
                          if (typeof value === 'number') {
                            setFieldValue('top', value);
                          } else {
                            setFieldValue('top', undefined);
                          }
                        }}
                        onBlur={handleBlur}
                        value={values.top}
                        placeholder={DEFAULT_TOP}
                      ></Field>
                      {values.pagingtype === 'offset' && (
                        <>
                          <Typography
                            variant='body1'
                            color={theme.palette.text.disabled}
                          >
                            Skip
                          </Typography>
                          <Field
                            name='skip'
                            type='number'
                            as={TextField}
                            // onChange={(_: any, value: number | '') => {
                            //   if (typeof value === 'number') {
                            //     setFieldValue('skip', value);
                            //   } else {
                            //     setFieldValue('skip', undefined);
                            //   }
                            // }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.skip}
                            placeholder={DEFAULT_SKIP}
                          ></Field>
                        </>
                      )}
                    </>
                  )}
                  {values.pagingtype === 'cursor' && (
                    <>
                      <Typography
                        variant='body1'
                        color={theme.palette.text.disabled}
                      >
                        After
                      </Typography>
                      <Field
                        name='after'
                        as={TextField}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.after}
                      ></Field>
                    </>
                  )}
                </>
              )}
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ParamsForm;

/**
 *
 *
 *
 * start by teaching core actovotyu
 *
 * going through activities aeound the ContentPasteTwoTone
 *
 * reserve last 20 to resevre for teachinf
 *
 * guy in brum upploads his own lesson plan
 */
