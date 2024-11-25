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
            try {
                const p256dh = subscription.getKey("p256dh");
                const auth = subscription.getKey("auth");
    
                if (!p256dh || !auth) {
                    console.error("Clés manquantes dans l'abonnement:", subscription);
                    throw new Error("Les clés de l'abonnement sont manquantes.");
                }
    
                return {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(p256dh))),
                        auth: btoa(String.fromCharCode.apply(null, new Uint8Array(auth))),
                    },
                };
            } catch (err) {
                console.error("Erreur lors de la sérialisation:", err);
                throw new Error("Impossible de sérialiser l'abonnement.");
            }
        };

        const subscribeToPush = async () => {
            try {
                if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
                    throw new Error("Votre navigateur ne supporte pas les notifications push.");
                }
    
                const registration = await navigator.serviceWorker.ready;
                const existingSubscription = await registration.pushManager.getSubscription();
    
                // Se désabonner de l'ancien abonnement (si nécessaire)
                if (existingSubscription) {
                    await existingSubscription.unsubscribe();
                }
    
                // Obtenir la clé publique VAPID depuis le serveur
                const response = await fetch(`${serverUrl}/vapidPublicKey`);
                if (!response.ok) {
                    throw new Error("Impossible de récupérer la clé publique VAPID.");
                }
                const { publicKey } = await response.json();
    
                // S'abonner aux notifications push
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: publicKey,
                });
    
                console.log("Nouvel abonnement créé:", subscription);
    
                // Sérialisation de l'abonnement
                const serializedSubscription = serializeSubscription(subscription);
    
                // Envoyer l'abonnement au serveur
                const subscriptionResponse = await fetch(`${serverUrl}/subscribe`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(serializedSubscription),
                });
    
                if (!subscriptionResponse.ok) {
                    throw new Error("Échec de l'enregistrement de l'abonnement sur le serveur.");
                }
    
                setSuccess("Notifications activées avec succès !");
                setError("");
            } catch (err) {
                console.error(err);
                setError(err.message);
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