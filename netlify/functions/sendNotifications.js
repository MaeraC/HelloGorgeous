
// netlify/functions/sendNotification.js
const path = require('path')
const { webpush } = require(path.resolve(__dirname, '../../server/push-notifications'))
const texts = require(path.resolve(__dirname, '../../server/datas.json'))

let subscriptions = []

exports.handler = async (event, context) => {
    const todayIndex = new Date().getDate() % texts.length

    const notificationPayload = {
        title: 'Hello Gorgeous!',
        body: texts[todayIndex], 
        icon: '/logo.png',
    }

    subscriptions.forEach((subData, index) => {
        const { subscription } = subData

        webpush
            .sendNotification(subscription, JSON.stringify(notificationPayload))
            .then(() => console.log(`Notification envoyée à l'abonnement ${index}`))
            .catch((err) => {
                console.error(`Erreur pour l'abonnement ${index}:`, err);
                subscriptions.splice(index, 1)
            })
    })

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'SendNotifications.js : Notifications envoyées avec succès' }),
    }
}

