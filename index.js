const axios = require('axios').default;
const api = require('etherscan-api').init('KACKVV54ZKQ3ZF4HGQXRZ5MCS3CIXMN9D2');

function apiLink(address) {
    return 'https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=' + address + '&startblock=0&endblock=999999999&sort=asc&apikey=YourApiKeyToken';
}

const address = '0xEcA19B1a87442b0c25801B809bf567A6ca87B1da';

axios.get(apiLink(address))
    .then(res => {
        const result = res.data.result;
        console.log(result);
    });