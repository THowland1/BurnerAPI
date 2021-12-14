// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { endpoints } from '../../../utils/airtable';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    switch (req.method) {
      case 'POST':
        const newEndpoint = await endpoints.create([
          {
            fields: {
              idPropName: req.body.idPropName,
              raw: JSON.stringify(req.body.raw),
            },
          },
        ]);
        res.status(200).json(newEndpoint);
        break;
      case 'GET':
        const endpointsPage1 = await endpoints.select().firstPage();
        const formattedEndpoints = endpointsPage1.map((endpoint) => ({
          id: endpoint.id,
          ...endpoint.fields,
        }));
        res.status(200).json(formattedEndpoints);
        break;
      default:
        res.status(404);
        break;
    }
  } catch (error) {
    res.status(500);
  }
}
