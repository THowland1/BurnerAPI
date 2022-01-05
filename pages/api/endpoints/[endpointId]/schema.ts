// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import GenerateSchema from 'generate-schema';
import type { NextApiRequest, NextApiResponse } from 'next';
import { endpoints, toRecId } from '../../../../utils/airtable';
import * as Assert from '../../../../utils/assert';

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

        Assert.string(rawData, 'raw must be a string');

        const data: Array<unknown> = JSON.parse(rawData);

        res.status(200).json(GenerateSchema.json('data', data));
        break;

      default:
        res.status(404);
        break;
    }
  } catch (error) {
    res.status(500).json({ error: 'no' });
  }
}
