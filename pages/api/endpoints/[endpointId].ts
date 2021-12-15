// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { endpoints, toRecId } from '../../../utils/airtable';
import { applyODataParams } from '../../../utils/apply-odata-params';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { endpointId } = req.query;
  const requestUri = decodeURI(req.url || '');
  try {
    if (Array.isArray(endpointId)) {
      throw new Error(
        `endpointId should be a single string, not an array (${JSON.stringify(
          endpointId
        )})`
      );
    }
    const recId = toRecId(endpointId);
    switch (req.method) {
      case 'GET':
        const existingEndpoint = await endpoints.find(recId);

        const rawData = existingEndpoint.fields.raw;
        if (typeof rawData !== 'string') {
          throw new Error('rawData must be a string');
        }

        const data: Array<unknown> = JSON.parse(rawData);

        const queryString = requestUri.split('?')?.[1] || '';
        const processedData = applyODataParams(data, queryString);
        res.status(200).json(processedData);
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
