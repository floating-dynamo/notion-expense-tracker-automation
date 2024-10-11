import { type CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';

export const getNotionDBConfig = ({
  configParams: { databaseId, title, amount, formattedDate, category, note, account },
}: {
  configParams: {
    databaseId: string;
    title: string;
    amount: number;
    formattedDate: string;
    category: string;
    note?: string;
    account?: string;
  };
}): CreatePageParameters => {
  return {
    parent: { database_id: databaseId },
    properties: {
      Title: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      Type: {
        select: {
          name: amount < 0 ? 'Expense' : 'Income',
        },
      },
      Date: {
        date: {
          start: formattedDate,
        },
      },
      Amount: {
        number: Math.abs(amount),
      },
      Category: {
        select: {
          name: category,
        },
      },
      Note: {
        rich_text: [
          {
            text: {
              content: note || '',
            },
          },
        ],
      },
      Account: {
        rich_text: [
          {
            text: {
              content: account || '',
            },
          },
        ],
      },
    },
  };
};
