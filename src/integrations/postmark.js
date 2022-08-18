const postmark = require('postmark');
const postmarkToken = process.env.postmarkToken;
const postmarkClient = new postmark.ServerClient(postmarkToken);

const sendEmail = async (sendEmailParams) => {
    await postmarkClient.sendEmailWithTemplate({
        TemplateId: process.env.postmarkTemplateId,
        From: 'contacto@knje.club',
        To: sendEmailParams.to,
        TemplateModel: {
            name: sendEmailParams.name,
            brand: sendEmailParams.brand,
            redeemedCode: sendEmailParams.code,
            url: sendEmailParams.url,
        },
    });
    return true;
};

module.exports.sendEmail = sendEmail;