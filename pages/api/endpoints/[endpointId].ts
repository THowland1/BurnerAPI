// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { endpoints, toRecId } from '../../../utils/airtable';
import * as Assert from '../../../utils/assert';
import {
  queryInMemory,
  QuerySummary,
} from '../../../utils/query/query-in-memory';

type SuccessResult<T> = {
  data: T[];
  summary: QuerySummary;
};

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
        const idPropName = existingEndpoint.fields.idPropName as string;

        Assert.string(rawData, 'raw must be a string');
        Assert.string(idPropName, 'idPropName must be a string');

        const idGetter = (item: any) => item[idPropName];

        const data: Array<unknown> = JSON.parse(rawData);

        const { data: queriedData, summary: querySummary } = queryInMemory(
          data,
          {} as any,
          idGetter
        );

        const successResult: SuccessResult<any> = {
          data: queriedData,
          summary: querySummary,
        };
        res.status(200).json(successResult);
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
