interface ITransaction {
    name: string;
    amount: number;
    expense: boolean;
    date: Date;
}

const initialTransaction: ITransaction = {
    name: "",
    amount: 0,
    expense: false,
    date: new Date(),
}

export { ITransaction, initialTransaction };