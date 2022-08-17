const axios = require('axios');
const dayjs = require('dayjs');
const shopifyApiVersion = '2022-07';

const createShopifyPriceRule = async (merchantConnectionMetadata, randomCode, redeemedAmount) => {
    const config = {
        url: `https://${merchantConnectionMetadata.url}.myshopify.com/admin/api/${shopifyApiVersion}/price_rules.json`,
        method: 'post',
        headers: {
            'X-Shopify-Access-Token': `${merchantConnectionMetadata.token}`,
        },
        data: {
            price_rule: {
                title: `${randomCode}`,
                target_type: 'line_item',
                target_selection: 'all',
                allocation_method: 'across',
                value_type: 'fixed_amount',
                value: `-${parseInt(redeemedAmount)}`,
                customer_selection: 'all',
                once_per_customer: true,
                usage_limit: 1,
                starts_at: dayjs().subtract(1, 'day').format('YYYY-MM-DD 00:00:00-04:00'),
            },
        },
    }
    const response = await axios(config);
    const data = response.data;
    return data.price_rule.id;
};

const createShopifyDiscountCode = async (merchantConnectionMetadata, priceRuleId, randomCode) => {
    const config = {
        url: `https://${merchantConnectionMetadata.url}.myshopify.com/admin/api/${shopifyApiVersion}/price_rules/${priceRuleId}/discount_codes.json`,
        method: 'post',
        headers: {
            'X-Shopify-Access-Token': `${merchantConnectionMetadata.token}`,
        },
        data: {
            discount_code: {
                code: `${randomCode}`,
            },
        },
    }
    const response = await axios(config);
    const data = response.data;
    return data.discount_code.code;
};

module.exports.createShopifyPriceRule = createShopifyPriceRule;
module.exports.createShopifyDiscountCode = createShopifyDiscountCode;