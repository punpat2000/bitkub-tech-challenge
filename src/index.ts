import axios from "axios";
import API_KEY from "./api.const";
import FIRST_ADDRESS from "./address.const";
import { Data, Balance } from "./data.model";

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
const calculate = (str: string) => parseInt(str) / Math.pow(10, 18);
const transList = new Array<string>();
const balanceList = new Array<string>();

async function findAllTransaction(address: string): Promise<void> {
  const response = await axios.get(apiLink(address));
  const result = response.data.result as Array<Data>;
  if (result.length === 0) {
    return;
  }
  for (let i = 0; i < result.length; i++) {
    const hash = result[i].hash;
    const from = result[i].from;
    const to = result[i].to;
    const value = result[i].value;
    const tokenSymbol = result[i].tokenSymbol;
    if (from !== address || tokenSymbol !== "BKTC") {
      continue;
    }
    transList.push(
      `hash ${hash}, from ${from} to ${result[i].to}, amount ${calculate(
        value
      )}`
    );
    const balance = ((await axios.get(balanceApiLink(address))).data as Balance).result;
    console.log(`address: ${address}, balance: ${calculate(balance)}`);
    balanceList.push(`address: ${address}, balance: ${calculate(balance)}`);
    await findAllTransaction(to);
  }
}

findAllTransaction(FIRST_ADDRESS).then(() => {
  transList.forEach((i) => console.log(i));
  balanceList.forEach((i) => console.log(i));
});
