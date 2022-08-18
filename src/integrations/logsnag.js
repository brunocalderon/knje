const axios = require('axios');

const createLog = async (logMessage) => {
    const config = {
        url: 'https://api.logsnag.com/v1/log',
        method: 'post',
        headers: {
            'Authorization': `Bearer ${process.env.logSnagToken}`,
        },
        json: true,
        data: {
            project: process.env.logSnagProject,
            channel: logMessage.channel,
            event: logMessage.event,
            description: logMessage.description,
            icon: logMessage.icon,
            notify: true,
            tags: {
                origin: logMessage.origin,
                destination: logMessage.destination,
                user: logMessage.user,
                amount: logMessage.amount,
            },
        },
    }
    try {
        const response = await axios(config);
        const data = response.data;
        return data;
    } catch (e) {
        console.log(e.data);
        return null;
    }
}

module.exports.createLog = createLog;