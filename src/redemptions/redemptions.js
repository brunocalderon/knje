const random = require('./randomorg');
const airtable = require('./airtable');
const shopify = require('./shopify');
const logsnag = require('../integrations/logsnag');
const postmark = require('../integrations/postmark');
const clpLocale = Intl.NumberFormat('es-CL');

const sendEmailConfirmation = async (userData, merchantData, randomCode) => {
    await postmark.sendEmail({
        to: userData.fields['Email'],
        name: userData.fields['User Name'],
        brand: merchantData.fields['Merchant Name'],
        code: randomCode,
        url: merchantData.fields['Website'],
    });
    return true;
}

const logRedemption = async (userData, merchantData, redeemedAmount) => {
    await logsnag.createLog({
        channel: 'redemptions',
        event: 'Redemption',
        description: `Nuevo canje de $${clpLocale.format(redeemedAmount)} en ${merchantData.fields['Merchant Name']}`,
        icon: '💰',
        origin: userData.fields['Merchant Name'][0],
        destination: merchantData.fields['Merchant Name'],
        user: userData.fields['Email'],
        amount: redeemedAmount,
    });
    return true;
}

const performRedemption = async (originMerchantId, destinationMerchantId, userId, redeemedAmount) => {
    const userData = await airtable.getAirtableUserData(userId);
    const merchantData = await airtable.getAirtableMerchantData(destinationMerchantId);
    const merchantPlatform = merchantData.fields['Connection'];
    const merchantConnectionMetadata = JSON.parse(merchantData.fields['Connection Metadata']);
    switch (merchantPlatform) {
        case 'Shopify':
            const randomCode = await random.getRandomString();
            await airtable.createAirtableTransaction(originMerchantId, destinationMerchantId, userId, redeemedAmount, randomCode);
            await shopify.createShopifyDiscount(merchantConnectionMetadata, randomCode, redeemedAmount);
            await sendEmailConfirmation(userData, merchantData, randomCode);
            await logRedemption(userData, merchantData, redeemedAmount);
            return randomCode;
        default:
            return null;
    }
}

module.exports.performRedemption = performRedemption;