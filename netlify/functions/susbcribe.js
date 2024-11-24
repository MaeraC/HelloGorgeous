// netlify/functions/subscribe.js
const { webpush } = require('../../server/push-notifications'); // On garde la logique de webpush

let subscriptions = [];

// Fonction handler pour gérer les abonnements
exports.handler = async (event, context) => {
    const body = JSON.parse(event.body);
    const subscription = body;
    
    // Vérification de l'existence de l'abonnement
    const exists = subscriptions.some(
        (sub) => sub.endpoint === subscription.endpoint && sub.keys.p256dh === subscription.keys.p256dh && sub.keys.auth === subscription.keys.auth
    );

    if (!exists) {
        subscriptions.push(subscription);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Abonnement enregistré avec succès !' }),
        };
    } 
    else {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Abonnement déjà existant.' }),
        };
    }
};
