// netlify/functions/sendNotification.js
const { webpush } = require('../../server/push-notifications');
const texts = require('../../server/datas.json');  // Tes textes de notification


let subscriptions = [];

exports.handler = async (event, context) => {
    const todayIndex = new Date().getDate() % texts.length;
    const notificationPayload = {
        title: 'Hello Gorgeous!',
        body: texts[todayIndex],  // Texte de notification
        icon: '/logo.png',
    };

    // Envoi de la notification à chaque abonné
    subscriptions.forEach((subscription, index) => {
        webpush
            .sendNotification(subscription, JSON.stringify(notificationPayload))
            .then(() => console.log(`Notification envoyée à l'abonnement ${index}`))
            .catch((err) => {
                console.error(`Erreur pour l'abonnement ${index}:`, err);
                subscriptions.splice(index, 1);  // Suppression de l'abonnement en cas d'erreur
            });
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Notifications envoyées avec succès' }),
    };
};

