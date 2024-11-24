import { useState } from "react";

// fichier frontend/src/App.js

function App() {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const serverUrl = 
    window.location.origin.includes('localhost') 
        ? 'http://localhost:5000'  
        : '/.netlify/functions';  

        // Fonction de sérialisation de l'abonnement
    const serializeSubscription = (subscription) => {
        // Vérification que les clés existent
        if (!subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
            console.error("Clés manquantes dans l'abonnement:", subscription);
            throw new Error("Les clés de l'abonnement sont manquantes.");
        }

        return {
            endpoint: subscription.endpoint,
            keys: {
                p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.keys.p256dh))),
                auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.keys.auth))),
            },
        };
    };

    const subscribeToPush = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            // Vérifier si un abonnement existe déjà
            const registration = await navigator.serviceWorker.ready;
            const existingSubscription = await registration.pushManager.getSubscription();
            
            if (existingSubscription) {
                // Se désabonner de l'ancien abonnement
                await existingSubscription.unsubscribe();
            }

            // Obtenir la clé publique du serveur
            const response = await fetch(`${serverUrl}/vapidPublicKey`);
            const { publicKey } = await response.json();
            console.log(publicKey)
        
            // S'abonner à la nouvelle clé publique
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicKey,
            });

               console.log("Nouvel abonnement:", subscription);

                // Sérialiser l'abonnement
                const serializedSubscription = serializeSubscription(subscription);

                // Enregistrer l'abonnement sur le serveur
                const subscriptionResponse = await fetch(`${serverUrl}/subscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(serializedSubscription),
                });

                if (!subscriptionResponse.ok) {
                    throw new Error("Impossible d'enregistrer l'abonnement");
                }
        
            setSuccess('Notifications activées avec succès !');
        } 
        else {
          setError('Votre navigateur ne supporte pas les notifications push.');
        }
    };

    return (
        <div style={{background: "pink"}}>
            <h1>Hello Gorgeous!</h1>
            <p>Active les notifications pour recevoir ton rappel quotidien.</p>
            <button onClick={subscribeToPush}>Activer les notifications</button>
            {error && <p style={{color: "red"}}>{error}</p>}
            {success && <p style={{color: "green"}}>{success}</p>}
        </div>
    )
}

export default App