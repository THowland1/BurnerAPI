import formattedReturn from './helpers/formattedReturn';
import getRoutes from './helpers/routes/getRoutes';
import createRoute from './helpers/routes/createRoute';
import deleteRoute from './helpers/routes/deleteRoute';
import updateRoute from './helpers/routes/updateRoute';
import getRoute from './helpers/routes/getRoute';
import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod === 'GET') {
    const pathSegments = event.path.split('/');
    const lastPathSegment = pathSegments[pathSegments.length - 1];
    if (lastPathSegment.includes('rec')) {
      return await getRoute(event, lastPathSegment);
    } else {
      return await getRoutes(event);
    }
  } else if (event.httpMethod === 'POST') {
    return await createRoute(event);
  } else if (event.httpMethod === 'PUT') {
    return await updateRoute(event);
  } else if (event.httpMethod === 'DELETE') {
    return await deleteRoute(event);
  } else {
    return formattedReturn(405, {});
  }
};

export { handler };
