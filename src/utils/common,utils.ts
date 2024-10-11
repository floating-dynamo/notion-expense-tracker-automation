import path from 'path';
import { parse } from 'papaparse';
import fs from 'fs';
import * as XLSX from 'xlsx';
import { Expense } from '../models';

export const INPUT_DIR = path.join(__dirname, '../input');
export const OUTPUT_DIR = path.join(__dirname, '../out');

export async function convertXlsxToJson(inputFilePath: string, outputFilePath: string) {
  const outTempCsvPath = path.join(OUTPUT_DIR, `/temp/${new Date().getMilliseconds()}.csv`);

  if (!fs.existsSync(path.join(OUTPUT_DIR, 'temp'))) {
    fs.mkdirSync(path.join(OUTPUT_DIR, 'temp'));
  }

  await convertXlsxToCsv(inputFilePath, outTempCsvPath);
  await convertCsvToJson(outTempCsvPath, outputFilePath, '~');
  if (fs.existsSync(outTempCsvPath)) {
    fs.rmSync(outTempCsvPath);
  }

  return outputFilePath;
}

export async function convertXlsxToCsv(inputFilePath: string, outFilePath: string) {
  try {
    const workbook = XLSX.readFile(inputFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const csvData = XLSX.utils.sheet_to_csv(worksheet, {
      blankrows: false,
      FS: '~',
    });
    fs.writeFileSync(outFilePath, csvData);
    console.log(`Successfully converted '${inputFilePath}' to '${outFilePath}'`);
  } catch (error) {
    console.log(`Error occured:\n`, (error as Error).stack);
  }
}

export async function convertCsvToJson(inputFilePath: string, outputFilePath: string, delimiter: string) {
  const jsonData = await readCsvFile(inputFilePath, delimiter);
  await writeJSONFile(outputFilePath, jsonData);
}

export async function readCsvFile(inputFilePath: string, delimiter: string): Promise<Expense[]> {
  const rawData = fs.readFileSync(inputFilePath, 'utf-8');
  const csvFile = parse<Expense>(rawData, {
    header: true,
    delimiter,
    skipEmptyLines: true,
  });
  return csvFile.data;
}

export async function writeJSONFile(outFilePath: string, data: any) {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
  fs.writeFileSync(outFilePath, JSON.stringify(data, null, 2));
  console.log('Output file written succuessfully', outFilePath);
}

export function getCustomTimestamp() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}
