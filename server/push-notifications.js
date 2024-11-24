
// fichier server/push-notifications.js

const webpush = require('web-push');
const fs = require('fs');

// Vérifie si on est en local ou sur Netlify
let vapidKeys;

// Si on est en local, on utilise le fichier JSON
if (process.env.NODE_ENV !== 'production') {
    const VAPID_KEYS_FILE = './server/vapid-keys.json';
    
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

