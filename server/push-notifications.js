
// Fichier server/push-notification.js
// Configuration web push 
/*
const webpush           = require('web-push');
const fs                = require('fs');

// Vérifie si les clés existent déjà dans un fichier
const VAPID_KEYS_FILE   = './vapid-keys.json';

// Si les clés n'existent pas, génère-les et les stocke
let vapidKeys;

if (fs.existsSync(VAPID_KEYS_FILE)) {
    vapidKeys = JSON.parse(fs.readFileSync(VAPID_KEYS_FILE, 'utf8'));
} 
else {
    vapidKeys = webpush.generateVAPIDKeys();
    // Sauvegarde les clés dans un fichier JSON pour les réutiliser
    fs.writeFileSync(VAPID_KEYS_FILE, JSON.stringify(vapidKeys), 'utf8');
    console.log('Clés VAPID générées et sauvegardées !');
}

// Configure web-push avec les clés générées
webpush.setVapidDetails(
    'mailto:dev.mc.studio@gmail.com', // Ton email
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

module.exports = { webpush, vapidKeys }; */

//******************************************************* */

// fichier server/push-notifications.js

const webpush = require('web-push');
const fs = require('fs');

let vapidKeys;

// Si on est en local, on utilise le fichier JSON
if (process.env.NODE_ENV !== 'production') {
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