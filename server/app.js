
// fichier server/app.js
// Serveur pour gérer l'envoie des notifications 

const express                   = require('express')
const cors                      = require('cors')
const { webpush, vapidKeys }    = require('./push-notifications')
const texts                     = require('./datas.json')
const app                       = express()

app.use(cors({
    origin: ['http://localhost:3000', 'https://hello-gorgeous-y.netlify.app'],  
    methods: ['GET', 'POST'],        
}))

app.use(express.json())

const subscriptions = []

// Route pour envoyer la clé publique au client
app.get('/vapidPublicKey', (req, res) => {
    res.json({ publicKey: vapidKeys.publicKey })
})

// Route pour enregistrer un abonnement (pas de doublon ici)
app.post('/subscribe', (req, res) => {
    const subscription = req.body
    
    const exists = subscriptions.some(
        (sub) => sub.endpoint === subscription.endpoint && sub.keys.p256dh === subscription.keys.p256dh && sub.keys.auth === subscription.keys.auth
    )

    if (!exists) {
        subscriptions.push(subscription)
        res.status(201).json({ message: 'Abonnement enregistré avec succès !' })
    } 
    else {
        res.status(200).json({ message: 'Abonnement déjà existant.' })
    }
})

// Envoie une notification
const sendNotification = () => {
    const todayIndex = new Date().getDate() % texts.length

    const notificationPayload = {
        title: 'Hello Gorgeous!',
        body: texts[todayIndex],
        icon: '/logo.png',
    }

    subscriptions.forEach((subscription, index) => {
        webpush
            .sendNotification(subscription, JSON.stringify(notificationPayload))
            .then(() => console.log(`Notification envoyée à l'abonnement ${index}`))
            .catch((err) => {
                console.error(`Erreur pour l'abonnement ${index}:`, err);
                subscriptions.splice(index, 1)
            })
    })
}

// Planifie une notification quotidienne
const scheduleDailyNotification = () => {
    const now = new Date()
    const targetTime = new Date()
    targetTime.setHours(17, 16, 0, 0)

    if (now > targetTime) targetTime.setDate(targetTime.getDate() + 1)

    const delay = targetTime - now
    console.log(`Prochaine notification dans ${Math.round(delay / 60000)} minutes.`)

    setTimeout(() => {
        sendNotification()
        scheduleDailyNotification()
    }, delay)
}

scheduleDailyNotification()

app.listen(5000, () => {
    console.log('Serveur Web Push démarré sur http://localhost:5000');
})
