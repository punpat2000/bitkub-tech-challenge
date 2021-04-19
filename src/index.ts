import axios from "axios";
import API_KEY from "./api.const";
import FIRST_ADDRESS from "./address.const";
import type { Data, Balance } from "./data.model";

const apiLink = (address: string) => {
  return `https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&API_KEY=${API_KEY}`;
};

const balanceApiLink = (address: string) => {
  return (
    "https://api-ropsten.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xb336aef321adc0fd059acb0be07a0c649ba40af3&address=" +
    address +
    "&tag=latest&apikey=" +
    API_KEY
  );
};
const calculate = (str: string) => Number(str) / (10 ** 18);
const transList = new Array<string>();
const balanceList = new Array<string>();

async function findAllTransaction(address: string): Promise<void> {
  const response = await axios.get(apiLink(address));
  const result = response.data.result as Array<Data>;
  if (result.length === 0) {
    return;
  }
  for (const trans of result) {
    const { hash, from, to, value, tokenSymbol } = trans;
    if (from !== address || tokenSymbol !== "BKTC") {
      continue;
    }
    transList.push(
      `hash ${hash}, from ${from} to ${to}, amount ${calculate(value)}`
    );
    const balance = ((await axios.get(balanceApiLink(address))).data as Balance)
      .result;
    // console.log(`address: ${address}, balance: ${calculate(balance)}`);
    balanceList.push(`address: ${address}, balance: ${calculate(balance)}`);
    return await findAllTransaction(to);
  }
}

console.log(`--------------------------------------------------------------------`)
findAllTransaction(FIRST_ADDRESS).then(() => {
  transList.forEach((i) => console.log(`${i}\n--------------------------------------------------------------------`));
  balanceList.forEach((i) => console.log(`${i}\n--------------------------------------------------------------------`));
});
