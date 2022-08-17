const random = require('./randomorg');
const airtable = require('./airtable');
const shopify = require('./shopify');

// const getRealMin = (minAmount, maxCr)

// const getMinMaxAmounts = (minAmount, maxAmount, maxDebits, maxCredits, currentBalance) {
//     const realMin = 
// }

const performRedemption = async (originMerchantId, destinationMerchantId, userId, redeemedAmount) => {
    const merchantData = await airtable.getAirtableSiteConnection(destinationMerchantId);
    const merchantPlatform = merchantData.fields['Connection'];
    const merchantConnectionMetadata = JSON.parse(merchantData.fields['Connection Metadata']);
    switch (merchantPlatform) {
        case 'Shopify':
            const randomCode = await random.getRandomString();
            await airtable.createAirtableTransaction(originMerchantId, destinationMerchantId, userId, redeemedAmount, randomCode);
            const priceRuleId = await shopify.createShopifyPriceRule(merchantConnectionMetadata, randomCode, redeemedAmount);
            const discountCode = await shopify.createShopifyDiscountCode(merchantConnectionMetadata, priceRuleId, randomCode);
            return discountCode;
            break;
        default:
            return null;
    }
}

module.exports.performRedemption = performRedemption;