// netlify/functions/vapidPublicKey.js
const { vapidKeys } = require('../../server/push-notifications');

exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ publicKey: vapidKeys.publicKey }),  // Renvoie la clé publique VAPID
    };
};
