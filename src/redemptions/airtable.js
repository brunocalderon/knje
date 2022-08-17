const axios = require('axios');

const getAirtableSiteConnection = async (merchantId) => {
    const config = {
        url: `https://api.airtable.com/v0/${process.env.airtableBaseId}/Merchants/${merchantId}`,
        method: 'get',
        headers: {
            'Authorization': `Bearer ${process.env.airtableToken}`,
        },
    }
    const response = await axios(config);
    const data = response.data;
    return data;
}

const getAirtableMerchantData = async (merchantId) => {
    const config = {
        url: `https://api.airtable.com/v0/${process.env.airtableBaseId}/Merchants/${merchantId}`,
        method: 'get',
        headers: {
            'Authorization': `Bearer ${process.env.airtableToken}`,
        },
    }
    const response = await axios(config);
    const data = response.data;
    return data;
}

const createAirtableTransaction = async (originMerchantId, destinationMerchantId, userId, redeemedAmount, code) => {
    const config = {
        url: `https://api.airtable.com/v0/${process.env.airtableBaseId}/Transactions`,
        method: 'post',
        headers: {
            'Authorization': `Bearer ${process.env.airtableToken}`,
        },
        json: true,
        data: {
            records: [
                {
                    fields: {
                        'Transaction Code': code,
                        'Origin': [
                            originMerchantId,
                        ],
                        'Destination': [
                            destinationMerchantId,
                        ],
                        'User': [
                            userId,
                        ],
                        'Amount': parseInt(redeemedAmount, 10),
                        'Transaction Type': 'Redemption',
                        'Transaction Status': 'Succeeded',
                    },
                },
            ],
        },
    }
    try {
        const response = await axios(config);
        const data = response.data;
        return data;
    } catch(e) {
        console.log(e.data);
        return null;
    }
}

module.exports.getAirtableSiteConnection = getAirtableSiteConnection;
module.exports.getAirtableMerchantData = getAirtableMerchantData;
module.exports.createAirtableTransaction = createAirtableTransaction;