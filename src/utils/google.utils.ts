import path from 'path';
import fs from 'fs';
import { Expense } from '../models';

const { GOOGLE_SHEET_LINK = '' } = process.env;

export async function getLatestGoogleSheet(outDir: string, filename: string) {
  const outputFilePath = path.join(outDir, filename);

  try {
    const rawData = await fetchGoogleSheetData();
    const parsedData = extractJsonFromResponse(rawData);
    const expenseData = transformDataToExpenses(parsedData);

    fs.writeFileSync(outputFilePath, JSON.stringify(expenseData, null, 2));
    console.log('Fetched the latest Google sheet and stored in:', outputFilePath);
  } catch (error) {
    console.error('Error fetching or processing Google sheet data:', error);
  }
}

// Fetches the raw text data from the Google sheet link
async function fetchGoogleSheetData(): Promise<string> {
  const response = await fetch(GOOGLE_SHEET_LINK);
  return response.text();
}

// Extracts and cleans the JSON data from the fetched response
function extractJsonFromResponse(jsonData: string): any {
  const startIndex = jsonData.indexOf('setResponse(') + 12; // Skip 'setResponse('
  const endIndex = jsonData.lastIndexOf(')'); // Remove the trailing ')'
  const cleanedJson = jsonData.substring(startIndex, endIndex);
  return JSON.parse(cleanedJson);
}

// Transforms the parsed Google sheet data into a structured format
function transformDataToExpenses(parsedData: any): Expense[] {
  const headers = parsedData.table.cols.map((col: any) => col.label);
  const rows = parsedData.table.rows.map((row: any) => row.c);

  return rows.map((row: any) => {
    let expense: any = {};
    row.forEach((item: any, index: number) => {
      expense[headers[index]] = item?.v ?? '';
    });
    return expense;
  });
}
