require('dotenv').config();
import airtable from 'airtable';
var base = new airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);
const table = base(process.env.AIRTABLE_TABLE_NAME);
const routes = base(process.env.AIRTABLE_ROUTES_TABLE_NAME);

export { table, routes };
