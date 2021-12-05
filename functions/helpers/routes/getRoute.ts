import { Event } from '@netlify/functions/dist/function/event';
import { routes } from '../airtable';
import { applyODataParams } from '../apply-odata-params';
import formattedReturn from '../formattedReturn';
export default async (event: Event, id: any) => {
  try {
    const routeData = await routes.find(id);
    const data: Array<unknown> = JSON.parse(routeData.fields.raw);
    const processedData = applyODataParams(data, event.rawQuery);
    return formattedReturn(200, processedData);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};
