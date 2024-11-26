

// netlify/functions/subscribe.js
let subscriptions = []

exports.handler = async (event, context) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "subscribe.js : Corps de la requête vide.",
                }),
            }
        }

        let body

        try {
            body = JSON.parse(event.body)
        } 
        catch (error) {
            console.error("subscribe.js : Erreur de parsing JSON :", error)

            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "subscribe.js : JSON invalide reçu.",
                    details: error.message,
                }),
            }
        }

        console.log('subscribe.js : Corps de la requête subscribe:', body)

        if ( !body.endpoint || !body.keys || !body.keys.p256dh || !body.keys.auth ) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "subscribe.js : Les clés `endpoint`, `p256dh` ou `auth` sont manquantes.",
                }),
            }
        }

        const subscription = body
        console.log("subscribe.js : Abonnement reçu :", subscription)

        const exists = subscriptions.some(
            (sub) =>
                sub.endpoint === subscription.endpoint &&
                sub.keys.p256dh === subscription.keys.p256dh &&
                sub.keys.auth === subscription.keys.auth
        )

        if (!exists) {
            subscriptions.push(subscription)

            return {
                statusCode: 201,
                body: JSON.stringify({
                    message: "subscribe.js : Abonnement enregistré avec succès !",
                }),
            }
        } 
        else {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "subscribe.js : Abonnement déjà existant.",
                }),
            }
        }
    } 
    catch (error) {
        console.error("subscribe.js : Erreur générale :", error)

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "subscribe.js : Erreur lors du traitement de l'abonnement.",
                details: error.message,
            }),
        }
    }
}


