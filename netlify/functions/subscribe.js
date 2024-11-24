
// netlify/functions/subscribe.js
let subscriptions = [];

// Fonction handler pour gérer les abonnements
exports.handler = async (event, context) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Le corps de la requête est vide.' }),
        };
    }

    try {
        // Log pour vérifier ce qui est reçu dans le corps de la requête
        console.log('Corps de la requête:', event.body);

        const body = JSON.parse(event.body);
        const subscription = body; // Le contenu de l'abonnement envoyé

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
    } 
    catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Erreur lors du parsing du JSON.', error: error.message }),
        };
    }
};
