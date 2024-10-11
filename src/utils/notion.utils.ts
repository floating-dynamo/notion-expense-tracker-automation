import { Client } from '@notionhq/client';
import { Expense } from '../models';
import { getNotionDBConfig } from '../configs/notion.config';

const { NOTION_INTEGRATION_SECRET } = process.env;

const notionInit = () => {
  let notion = null;
  if (!notion) {
    notion = new Client({
      auth: NOTION_INTEGRATION_SECRET,
    });
  }
  return notion;
};

async function addTransactionToNotion(expense: Expense, databaseId: string) {
  const {
    Amount: amount,
    Category: category,
    Date,
    FormattedDate: formattedDate,
    Note: note,
    Title: title,
    Account: account,
  } = expense;
  const parsedAmount = parseFloat(amount as unknown as string);
  try {
    const notion = notionInit();
    await notion.pages.create(
      getNotionDBConfig({
        configParams: {
          databaseId,
          amount: parsedAmount,
          category,
          formattedDate,
          title,
          account,
          note,
        },
      })
    );
    parsedAmount < 0 ? console.log(`Added Expense: ${title}`) : console.log(`Added Income: ${title}`);
  } catch (error) {
    console.error(`Failed to add: ${title}`, error);
  }
}

export async function addTransactionsToNotion(expenses: Expense[], databaseId: string) {
  for (const expense of expenses) {
    await addTransactionToNotion(expense, databaseId);
  }
}
