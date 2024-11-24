// Fichier server/push-notification.js
// Configuration Web Push

const webpush = require('web-push');
const fs = require('fs');

// Clés VAPID
let vapidKeys;

// Vérification de l'environnement
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
    // En local, utiliser ou générer les clés VAPID
    console.log('Mode local détecté. Utilisation des clés VAPID du fichier JSON.');

    const VAPID_KEYS_FILE = './vapid-keys.json';

    if (fs.existsSync(VAPID_KEYS_FILE)) {
        // Lire les clés depuis le fichier JSON
        vapidKeys = JSON.parse(fs.readFileSync(VAPID_KEYS_FILE, 'utf8'));
    } else {
        // Générer de nouvelles clés et les sauvegarder
        vapidKeys = webpush.generateVAPIDKeys();
        fs.writeFileSync(VAPID_KEYS_FILE, JSON.stringify(vapidKeys), 'utf8');
        console.log('Clés VAPID générées et sauvegardées en local.');
    }
} else {
    // En production, utiliser les variables d'environnement de Netlify
    console.log('Mode production détecté. Utilisation des clés VAPID des variables d\'environnement.');

    // Vérifier si les variables d'environnement sont présentes
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
        throw new Error('Les clés VAPID ne sont pas définies dans les variables d\'environnement.');
    }

    vapidKeys = {
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY
    };
}

// Configurer web-push avec les clés VAPID
webpush.setVapidDetails(
    'mailto:dev.mc.studio@gmail.com', // Ton email
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

module.exports = { webpush, vapidKeys };
