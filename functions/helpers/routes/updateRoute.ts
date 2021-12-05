import { routes } from '../airtable';
import formattedReturn from '../formattedReturn';
export default async (event) => {
  const { id, ...fields } = JSON.parse(event.body);
  try {
    const updatedRoute = await routes.update([{ id, fields }]);
    return formattedReturn(200, updatedRoute);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};
