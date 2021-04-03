const axios = require("axios").default;
const api = require("etherscan-api").init("KACKVV54ZKQ3ZF4HGQXRZ5MCS3CIXMN9D2");

function apiLink(address) {
  return (
    "https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=" +
    address +
    "&startblock=0&endblock=999999999&sort=asc&apikey=KACKVV54ZKQ3ZF4HGQXRZ5MCS3CIXMN9D2"
  );
}

function balanceApiLink(address) {
  return (
    "https://api-ropsten.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xb336aef321adc0fd059acb0be07a0c649ba40af3&address=" +
    address +
    "&tag=latest&apikey=KACKVV54ZKQ3ZF4HGQXRZ5MCS3CIXMN9D2"
  );
}

const first_address = "0xeca19b1a87442b0c25801b809bf567a6ca87b1da";

// axios.get(apiLink(address)).then((res) => {
//   const result = res.data.result;
//   console.log(result[0].hash);
// });

const transList = [];
const balanceList = [];

function calculate(str){
  return parseInt(str) / Math.pow(10, 18);
}

async function findAllTransaction(address) {
  const response = await axios.get(apiLink(address));
  const result = response.data.result;
  if (result.length === 0) return;
  for (let i = 0; i < result.length; i++) {
    const hash = result[i].hash;
    const from = result[i].from;
    const to = result[i].to;
    const value = result[i].value;
    const tokenSymbol = result[i].tokenSymbol;
    if (from !== address || tokenSymbol !== "BKTC") continue;
    console.log(
      `hash ${hash}, from ${from} to ${result[i].to}, amount ${calculate(value)}`
    );
    transList.push(`hash ${hash}, from ${from} to ${result[i].to}, amount ${calculate(value)}`);
    const balance = (await axios.get(balanceApiLink(address))).data.result;
    console.log(`address: ${address}, balance: ${calculate(balance)}`);
    balanceList.push(`address: ${address}, balance: ${calculate(balance)}`);
    await findAllTransaction(to);
  }
}

findAllTransaction(first_address);
// for (const trans in transList)
//   console.log(trans);
// for (const balance in balanceList)
//   console.log(balance);