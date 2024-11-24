
// Fichier server/push-notification.js
// Configuration web push 

const webpush = require('web-push');
const fs = require('fs');

let vapidKeys;

// Si on est en local, on utilise le fichier JSON
if (process.env.NODE_ENV !== 'production') {
    console.log('Mode local détecté. Utilisation des clés VAPID du fichier JSON.')
    console.log('Clés VAPID (production) :', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

    const VAPID_KEYS_FILE = './vapid-keys.json';
    
    if (fs.existsSync(VAPID_KEYS_FILE)) {
        vapidKeys = JSON.parse(fs.readFileSync(VAPID_KEYS_FILE, 'utf8'));
    } 
    else {
        vapidKeys = webpush.generateVAPIDKeys();
        // Sauvegarde les clés dans un fichier JSON pour les réutiliser en local
        fs.writeFileSync(VAPID_KEYS_FILE, JSON.stringify(vapidKeys), 'utf8');
        console.log('Clés VAPID générées et sauvegardées !');
    }
} 
else {
    // En production (Netlify), on utilise les variables d'environnement
    console.log('Mode production détecté. Utilisation des clés VAPID des variables d\'environnement.');

    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
        throw new Error('Les clés VAPID ne sont pas définies dans les variables d\'environnement.');
    }

    vapidKeys = {
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY
    };
}

// Configure web-push avec les clés VAPID
webpush.setVapidDetails(
    'mailto:dev.mc.studio@gmail.com', // Ton email
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

module.exports = { webpush, vapidKeys };