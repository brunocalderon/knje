// footer
$(document).ajaxSuccess(function (event, xhr, settings) {
    const successUrl = settings.url;
    const targetAction = 'Merchants/records/';
    const isSuccessFromRecord = successUrl.includes(targetAction);
    if (isSuccessFromRecord) {
        buildRedeemUrl(window.records);
    }
});

// end page redemptions
function buildRedeemUrl(rawRecords) {
    /* records */
    const merchant = Object.entries(rawRecords)[0][1].record.fields;
    const destinationMerchantId = merchant['Merchant ID'];
    const userId = window.logged_in_user.airtable_record_id;
    const originMerchantId = window.logged_in_user['Merchant'][0];
    
    const redeemUrl = `https://api.knje.club/transactions/new?origin=${originMerchantId}&destination=${destinationMerchantId}&user=${userId}`;
    
    window.location = redeemUrl;
}