require('dotenv').config();
import airtable from 'airtable';
var base = new airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID || 'UNSPECIFIED'
);
const endpoints = base(
  process.env.AIRTABLE_ENDPOINTS_TABLE_NAME || 'UNSPECIFIED'
);

export { endpoints };
