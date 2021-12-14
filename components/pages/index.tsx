import {
  Button,
  Card,
  CardContent,
  Color,
  FormControl,
  InputLabel,
  MenuItem,
  PaletteColor,
  Select,
  styled,
  Theme,
  Typography,
} from '@mui/material';
import { Box, lighten, useTheme } from '@mui/system';
import GenerateSchema from 'generate-schema';
import json5 from 'json5';
import compare from 'just-compare';
import get from 'just-safe-get';
import unique from 'just-unique';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { FC, useEffect, useState } from 'react';
import ParamsTable from './ParamsTable';
const JSONEditor = dynamic(() => import('../json-editor'), {
  loading: () => <>...</>,
  ssr: false,
});
const Code = dynamic(() => import('../Code'), {
  loading: () => <>...</>,
  ssr: false,
});

const Spacer: FC<{ size?: string }> = ({ size = '1rem' }) => (
  <Box sx={{ display: 'inline-block', height: size, width: size }} />
);

const GutterContainer: FC = ({ children }) => (
  <Box
    sx={{
      paddingLeft: '2rem',
      paddingRight: '2rem',
    }}
  >
    <Box
      sx={{
        maxWidth: '75rem',
        margin: 'auto',
      }}
    >
      {children}
    </Box>
  </Box>
);

const Criterion: FC<{ success: boolean }> = (props) => {
  const theme = useTheme<Required<Theme>>();

  const palette: Partial<Color> & PaletteColor = props.success
    ? theme.palette.success
    : theme.palette.error;
  return (
    <Box sx={{ display: 'flex', marginTop: '1rem', alignItems: 'center' }}>
      <Box
        sx={{
          background: palette[50],
          padding: '.5rem',
          borderRadius: '2rem',
        }}
      >
        <Box
          sx={{
            background: palette.light,
            padding: '.5rem',
            borderRadius: '1rem',
          }}
        ></Box>
      </Box>
      <Box sx={{ flex: 1, alignSelf: 'center', paddingLeft: '0.5rem' }}>
        <Typography variant='body1' component='span'>
          {props.children}
        </Typography>
      </Box>
    </Box>
  );
};

const Home: NextPage = () => {
  const theme = useTheme<Required<Theme>>();
  const [editorFontSize, setEditorFontSize] = useState(1);
  const [data, setData] = useState<string>(`[

]`);
  const [idPropName, setIdPropName] = useState<string | null>('');
  const [idPropNameOptions, setIdPropNameOptions] = useState<string[]>([]);

  useEffect(() => {
    if (idPropName && !idPropNameOptions.includes(idPropName)) {
      setIdPropName(null);
    }
  }, [idPropNameOptions, idPropName]);

  useEffect(() => {
    let json: any;
    try {
      json = json5.parse(data);
    } catch {
      return;
    }
    if (!Array.isArray(json)) {
      return;
    }
    const schema = GenerateSchema.json('data', json);
    if (schema.items.type !== 'object') {
      return;
    }
    const props = Object.entries(schema.items.properties);
    const keys = props
      .filter(
        ([_, value]) => value.type === 'number' || value.type === 'string'
      )
      .map(([key]) => key);
    setIdPropNameOptions(keys);
  }, [data]);

  const prettify = (s: string) => {
    const asJson = json5.parse(s);
    const asString = json5.stringify(asJson, null, 2);
    return asString;
  };

  const analyseJSONString = (s: string) => {
    const response = {
      isValidJSON5: false,
      isArray: false,
      isntEmpty: false,
      isArrayOfObjects: false,
      isArrayOfSameType: false,
      hasIdColumn: false,
      hasUniqueColumns: false,
      allGood: false,
    };

    let json: any;
    try {
      json = json5.parse(s);
      response.isValidJSON5 = true;
    } catch {
      return response;
    }

    if (Array.isArray(json)) {
      response.isArray = true;
    } else {
      return response;
    }

    if (json.length >= 1) {
      response.isntEmpty = true;
    } else {
      return response;
    }

    const schema = GenerateSchema.json('data', json);
    if (schema.items.type === 'object') {
      response.isArrayOfObjects = true;
    } else {
      return response;
    }

    const keys = Object.keys(schema.items.properties);
    const requiredKeys = schema.items.required;
    const eachPropHasSingleType = (
      Object.values(schema.items.properties) as { type: any }[]
    ).every((o) => typeof o.type === 'string');
    if (
      (!requiredKeys || compare(keys, requiredKeys)) &&
      eachPropHasSingleType
    ) {
      response.isArrayOfSameType = true;
    } else {
      return response;
    }

    if (idPropName) {
      response.hasIdColumn = true;
    } else {
      return response;
    }

    const allIdValues = json.map((o) => get(o, idPropName));
    if (unique(allIdValues).length === allIdValues.length) {
      response.hasUniqueColumns = true;
    } else {
      return response;
    }

    response.allGood = true;
    return response;
  };

  const analysedData = analyseJSONString(data);

  return (
    <Box>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box
        component='header'
        sx={{
          color: theme.palette.text.secondary,
          bgcolor: theme.palette.grey[900],
        }}
      >
        <GutterContainer>
          <Typography variant='h1' component='h1'>
            BurnerAPI
          </Typography>
          <Typography variant='h3' component='p'>
            Instanly turn a JSON string into a REST endpoint
          </Typography>
        </GutterContainer>
      </Box>

      <Box
        component='main'
        sx={{
          position: 'relative',
          minHeight: '5rem',
          '&:before': {
            content: '" "',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5rem',
            backgroundColor: theme.palette.grey[900],
            zIndex: -1,
          },
        }}
      >
        <GutterContainer>
          <Card elevation={2}>
            <CardContent>
              <Typography variant='h3' component='h2'>
                Data
              </Typography>
              <Typography variant='body1' color={theme.palette.text.disabled}>
                Paste JSON into here
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                }}
              >
                <JSONEditor
                  style={{
                    width: '100%',
                    borderRadius: '.5rem',
                    paddingTop: '0.5rem',
                  }}
                  value={data}
                  onChange={(newData) => setData(newData)}
                  fontSize={editorFontSize + 'rem'}
                />

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    right: '0.5rem',
                    zIndex: 1,
                  }}
                >
                  <Button
                    variant='contained'
                    color='secondary'
                    size='small'
                    disabled={!analysedData.isValidJSON5}
                    onClick={() => setData(prettify(data))}
                    style={{
                      borderRadius: '100rem',
                    }}
                  >
                    Prettify
                  </Button>
                  <Spacer size='.5rem' />
                  <Button
                    variant='contained'
                    color='secondary'
                    size='small'
                    onClick={() => setEditorFontSize(editorFontSize - 0.1)}
                    style={{
                      borderRadius: '100rem',
                      width: '2rem',
                    }}
                  >
                    -
                  </Button>
                  <Spacer size='.5rem' />
                  <Button
                    variant='contained'
                    color='secondary'
                    size='small'
                    onClick={() => setEditorFontSize(editorFontSize + 0.1)}
                    style={{
                      borderRadius: '100rem',
                    }}
                  >
                    +
                  </Button>
                </Box>
              </Box>

              <Criterion success={analysedData.isValidJSON5}>
                Valid JSON
              </Criterion>
              <Criterion success={analysedData.isArray}>
                Valid JSON array
              </Criterion>
              <Criterion success={analysedData.isntEmpty}>
                Array is not empty
              </Criterion>
              <Criterion success={analysedData.isArrayOfObjects}>
                All items are objects
              </Criterion>
              <Criterion success={analysedData.isArrayOfSameType}>
                All items have the same type
              </Criterion>
              <Criterion success={analysedData.hasIdColumn}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <div>Item has ID column</div>
                  &nbsp; &mdash; &nbsp;
                  <FormControl
                    variant='filled'
                    sx={{
                      minWidth: '6rem',
                      '& *': {
                        paddingTop: 0,
                        paddingBottom: 0,
                        paddingRight: 0,
                      },
                    }}
                  >
                    <Select
                      value={idPropName}
                      fullWidth
                      onChange={(e) => setIdPropName(e.target.value)}
                      sx={{
                        minWidth: '6rem',
                        '& *': {
                          paddingTop: 0,
                          paddingBottom: 0,
                          paddingRight: 0,
                        },
                      }}
                    >
                      {idPropNameOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          <code> {option} </code>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Criterion>
              <Criterion success={analysedData.hasUniqueColumns}>
                ID values are unique
              </Criterion>
              <Button
                variant='contained'
                disabled={!analysedData.allGood}
                onClick={() => {}}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                Create API
              </Button>
            </CardContent>
          </Card>
        </GutterContainer>
      </Box>
      <GutterContainer>
        <Spacer size='1rem' />

        <Typography variant='h3' component='h2' sx={{ paddingBottom: '.5rem' }}>
          Endpoints
        </Typography>

        <Typography variant='h4' component='p' sx={{ paddingBottom: '.5rem' }}>
          REST
        </Typography>

        <Card elevation={2}>
          <CardContent>
            <Typography variant='h3' component='h2'>
              Get all
            </Typography>
            <Spacer size='.5rem' />
            <Typography variant='body1' color={theme.palette.text.disabled}>
              cURL
            </Typography>
            <Box
              sx={{
                borderRadius: '.5rem',
                backgroundColor: theme.palette.grey['900'],
                color: 'white',
                padding: '.5rem 1rem',
              }}
            >
              <Code language='bash'>{`curl "https://api.tomhowland.com/odata/rec1748295?skip=0"`}</Code>
            </Box>
            <Spacer size='.5rem' />
            <Typography variant='body1' color={theme.palette.text.disabled}>
              Response
            </Typography>
            <Box
              sx={{
                borderRadius: '.5rem',
                backgroundColor: theme.palette.grey['900'],
                color: 'white',
                padding: '.5rem 1rem',
              }}
            >
              <Code language='json5'>{`{
    yello: 12, // ruh ruh 
    "crumbly": 'ddddd',
    randy: {
      ishe: false
    }
}`}</Code>
            </Box>
            <Spacer size='.5rem' />
            <Typography variant='body1' color={theme.palette.text.disabled}>
              Parameters
            </Typography>
            <ParamsTable />
          </CardContent>
        </Card>
      </GutterContainer>
      <GutterContainer>
        <Box component='footer'>Footer</Box>
      </GutterContainer>
    </Box>
  );
};

export default Home;
