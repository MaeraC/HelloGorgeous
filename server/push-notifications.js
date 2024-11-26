
// Fichier server/push-notification.js
const webpush = require('web-push')
const fs = require('fs')

let vapidKeys
const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) {
    console.log('push-notifications.js : Mode local détecté. Utilisation des clés VAPID du fichier JSON.')
    const VAPID_KEYS_FILE = './vapid-keys.json'

    if (fs.existsSync(VAPID_KEYS_FILE)) {
        vapidKeys = JSON.parse(fs.readFileSync(VAPID_KEYS_FILE, 'utf8'))
    } 
    else {
        vapidKeys = webpush.generateVAPIDKeys()
        fs.writeFileSync(VAPID_KEYS_FILE, JSON.stringify(vapidKeys), 'utf8')
        console.log('push-notifications.js : Clés VAPID générées et sauvegardées en local.')
    }
} 
else {
    console.log('push-notifications.js : Mode production détecté. Utilisation des clés VAPID des variables d\'environnement.');

    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
        throw new Error('Les clés VAPID ne sont pas définies dans les variables d\'environnement.');
    }

    vapidKeys = { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY }
}

webpush.setVapidDetails(
    'mailto:dev.mc.studio@gmail.com', 
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

module.exports = { webpush, vapidKeys }
