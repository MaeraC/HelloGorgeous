
// netlify/functions/subscribe.js
let subscriptions = [];

// Fonction handler pour gérer les abonnements
/*
exports.handler = async (event, context) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Le corps de la requête est vide.' }),
        };
    }

     try {
        const body = JSON.parse(event.body);
        const subscription = body

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
};*/


exports.handler = async (event, context) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Le corps de la requête est vide.' }),
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { subscription, notification } = body;

        if (!subscription || !notification) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'L\'abonnement ou le contenu de la notification manque.' }),
            };
        }
       
        // Ajouter l'abonnement et la notification au tableau
        subscriptions.push({ subscription, notification });

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Abonnement et contenu de la notification enregistrés avec succès !' }),
        };
    } 
    catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Erreur lors du parsing du JSON.', error: error.message }),
        };
    }
};