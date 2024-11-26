
// netlify/functions/vapidPublicKey.js
const path = require('path')
const { vapidKeys } = require(path.resolve(__dirname, '../../server/push-notifications'))

exports.handler = async (event, context) => {
    if (!vapidKeys.publicKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'vapidPublicKey.js : Clé publique VAPID non disponible.' }),
        }
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({ publicKey: vapidKeys.publicKey }), 
    }
}
