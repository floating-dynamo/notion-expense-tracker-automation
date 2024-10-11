export interface Expense {
  FormattedDate: string;
  Date: string;
  Amount: number;
  Category: ExpenseCategory;
  Title: string;
  Note?: string;
  Account?: string;
}

export enum ExpenseCategory {
  TRANSPORTATION = 'Transportation',
  GROCERIES = 'Groceries',
  SHOPPING = 'Shopping',
  ENTERTAINMENT = 'Entertainment',
  BILLS_AND_FEES = 'Bills & Fees',
  GIFTS = 'Gifts',
  WORK = 'Work',
  TRAVEL = 'Travel',
  INCOME = 'Income',
  FOOD = 'Food',
  UTILITY = 'Utility',
  INVESTMENTS = 'Investments',
  LIFESTYLE = 'Lifestyle',
  MEDICINE = 'Medicine',
  SELL = 'Sell',
}
