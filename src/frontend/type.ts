export type Transaction = {
    id: number;
    method: string;
    buyAmount: number | null;
    buyCurrency: string | null;
    buyToken: string | null;
    sellAmount: number | null;
    sellCurrency: string | null;
    sellToken: string | null;
    feeAmount: number | null;
    feeCurrency: string | null;
    feeToken: string | null;
    date: string; // serialized from Date via Response.json
    txHash: string | null;
    blockHeight: string | null;
    network: string | null;
    smartContract: string | null;
    senderAddress: string | null;
    receiverAddress: string | null;
    comments: string | null;
  };