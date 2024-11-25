
// netlify/functions/subscribe.js
let subscriptions = [];

// Fonction handler pour gérer les abonnements
exports.handler = async (event, context) => {
    try {
        const body = JSON.parse(event.body);
        console.log('Corps de la requête subscribe:', body);

        const subscription = body; 

       // const exists = subscriptions.some(
        //    (sub) => sub.endpoint === subscription.endpoint && sub.keys.p256dh === subscription.keys.p256dh && sub.keys.auth === subscription.keys.auth
        //);

        if (!subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Subscribe.js : Les clés `p256dh` ou `auth` sont manquantes." }),
            };
        }
        
        console.log("Abonnement reçu :", subscription);

        const exists = subscriptions.some(
            (sub) =>
                sub.endpoint === subscription.endpoint &&
                sub.keys.p256dh === subscription.keys.p256dh &&
                sub.keys.auth === subscription.keys.auth
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
    } 
    catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Erreur lors du traitement de l'abonnement.", details: error.message }),
        };
    }
};
