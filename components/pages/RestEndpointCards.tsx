import { Card, CardContent, Theme, Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import json5 from 'json5';
import dynamic from 'next/dynamic';
import React, { FC, useEffect, useState } from 'react';
import ParamsTable from './ParamsTable';

async function getData(url = '') {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit

    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

const Code = dynamic(() => import('../Code'), {
  loading: () => <>...</>,
  ssr: false,
});

const Spacer: FC<{ size?: string }> = ({ size = '1rem' }) => (
  <Box sx={{ display: 'inline-block', height: size, width: size }} />
);

const RestEndpointCards: FC<{ endpointId: string | null }> = ({
  endpointId,
}) => {
  const theme = useTheme<Required<Theme>>();
  const [origin, setOrigin] = useState('');
  const [getAllUrl, setGetAllUrl] = useState(
    `${origin}/api/endpoints/${endpointId || '{your-endpoint-id}'}`
  );
  const [getAllResponse, setGetAllResponse] = useState(`{
  // ...
  // you'll see when you create your endpoint
  // ... 
}`);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    async function run() {
      const newUrl = `${origin}/api/endpoints/${
        endpointId || '{your-endpoint-id}'
      }`;
      setGetAllUrl(newUrl);
      if (origin && endpointId) {
        const response = await getData(newUrl);
        setGetAllResponse(json5.stringify(response, null, 2));
      }
    }
    run();
  }, [origin, endpointId, setGetAllUrl]);

  return (
    <>
      <Typography
        variant='h3'
        component='h2'
        sx={{ paddingBottom: '.5rem', paddingTop: '1rem' }}
      >
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
            <Code language='bash'>{`curl "${getAllUrl}"`}</Code>
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
            <Code language='json5'>{getAllResponse}</Code>
          </Box>
          <Spacer size='.5rem' />
          <Typography variant='body1' color={theme.palette.text.disabled}>
            Parameters
          </Typography>
          <ParamsTable />
        </CardContent>
      </Card>
    </>
  );
};

export default RestEndpointCards;
