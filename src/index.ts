import 'dotenv/config';
import path from 'path';
import { getCustomTimestamp, OUTPUT_DIR } from './utils/common,utils';
import { getLatestGoogleSheet } from './utils/google.utils';
import fs from 'fs';
import { Expense } from './models';
import { addTransactionsToNotion } from './utils/notion.utils';

const { NOTION_DATABASE_ID } = process.env;

async function main() {
  const googleJsonFileName = 'googleSheet';
  const googleSheetJson = `${googleJsonFileName}-${getCustomTimestamp()}.json`;

  await getLatestGoogleSheet(OUTPUT_DIR, googleSheetJson);
  const expenses = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, googleSheetJson)).toString()) as Expense[];
  await addTransactionsToNotion(expenses, NOTION_DATABASE_ID!);
}

try {
  main();
} catch (error) {
  console.log((error as Error).stack);
}
