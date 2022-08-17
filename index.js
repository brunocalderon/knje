// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: false
});
const path = require('path');

fastify.register(require('@fastify/view'), {
    engine: {
        ejs: require('ejs'),
    },
});

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, './static'),
    prefix: '/static/', // optional: default '/'
});

// Require app logic
const redemptions = require('./src/redemptions/redemptions');
const airtable = require('./src/redemptions/airtable');

fastify.get('/transactions/new', async (request, reply) => {
    const originMerchantId = request.query.origin;
    const destinationMerchantId = request.query.destination;
    const userId = request.query.user;

    const originMerchantData = await airtable.getAirtableMerchantData(originMerchantId);
    console.log(originMerchantData);
    const destinationMerchantData = await airtable.getAirtableMerchantData(destinationMerchantId);

    const clpLocale = Intl.NumberFormat('es-CL');
    const minAmount = originMerchantData.fields['Merchant Balance'] > 1000 ? 1000 : 1000 + originMerchantData.fields['Merchant Balance'];
    const maxAmount = originMerchantData.fields['Merchant Balance'] > 300000 ? 300000 : 300000 - originMerchantData.fields['Merchant Balance']

    await reply.view('/src/templates/new-transaction.ejs', {
        origin: originMerchantId,
        destination: destinationMerchantId,
        user: userId,
        title: 'Nuevo Knje',
        brand: 'Komono',
        createTransactionButtonText: 'Knjear',
        availableBalance: clpLocale.format(originMerchantData.fields['Merchant Balance']),
        min: minAmount,
        max: maxAmount,
        minFormat: clpLocale.format(minAmount),
        maxFormat: clpLocale.format(maxAmount),
    });
});

fastify.post('/redemptions', async (request, reply) => {
    const originMerchantId = request.query.origin;
    const destinationMerchantId = request.query.destination;
    const userId = request.query.user;
    const redeemedAmount = request.query.amount;
    const performedRedemption = await redemptions.performRedemption(originMerchantId, destinationMerchantId, userId, redeemedAmount);
    reply.send({
        success: true,
        code: performedRedemption,
    })
})

// Run the server!
const start = async () => {
    try {
        await fastify.listen({
            port: 3000
        })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()