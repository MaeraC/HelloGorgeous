
// Fichier server/push-notification.js
// Configuration web push 

const webpush = require('web-push');
const fs = require('fs');

let vapidKeys;

// Détection de l'environnement
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
    // En local, utiliser ou générer les clés VAPID
    console.log('Mode local détecté. Utilisation des clés VAPID du fichier JSON.')
    const VAPID_KEYS_FILE = './vapid-keys.json'

    if (fs.existsSync(VAPID_KEYS_FILE)) {
        // Lire les clés depuis le fichier JSON
        vapidKeys = JSON.parse(fs.readFileSync(VAPID_KEYS_FILE, 'utf8'))
    } 
    else {
        // Générer de nouvelles clés et les sauvegarder
        vapidKeys = webpush.generateVAPIDKeys()
        fs.writeFileSync(VAPID_KEYS_FILE, JSON.stringify(vapidKeys), 'utf8')
        console.log('Clés VAPID générées et sauvegardées en local.')
    }
} else {
    // En production, utiliser les variables d'environnement
    console.log('Mode production détecté. Utilisation des clés VAPID des variables d\'environnement.')

    // Vérifier que les variables d'environnement sont définies
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
        throw new Error('Les clés VAPID ne sont pas définies dans les variables d\'environnement.')
    }

    vapidKeys = {
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY,
    }
}

// Configurer web-push avec les clés VAPID
webpush.setVapidDetails(
    'mailto:dev.mc.studio@gmail.com', // Remplace par ton email
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

module.exports = { webpush, vapidKeys }