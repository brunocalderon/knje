const axios = require('axios');

const getRandomString = async() => {
    const config = {
        url: 'https://api.random.org/json-rpc/4/invoke',
        method: 'post',
        headers: {
            'Authorization': `Bearer ${process.env.randomOrgToken}`,
        },
        data: {
            jsonrpc: '2.0',
            method: 'generateStrings',
            params: {
                apiKey: `${process.env.randomOrgToken}`,
                n: 1,
                length: 16,
                characters: 'abcdefghijklmnopqrstuvwxyz0123456789',
                replacement: false
            },
            id: 'knje'
        }
    }
    const response = await axios(config);
    const data = response.data;
    const randomCode = data.result.random.data[0];
    return `knje-${randomCode}`;
}

module.exports.getRandomString = getRandomString;