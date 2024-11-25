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
                    throw new Error("Les clés `p256dh` ou `auth` sont absentes.");
                }
        
                // Conversion sécurisée des clés en Base64
                const keys = {
                    p256dh: btoa(String.fromCharCode(...new Uint8Array(p256dh))),
                    auth: btoa(String.fromCharCode(...new Uint8Array(auth))),
                };
        
                return {
                    endpoint: subscription.endpoint,
                    keys,
                };
            } 
            catch (err) {
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
                    console.log("Ancien abonnement détecté :", existingSubscription);
                    await existingSubscription.unsubscribe();
                    console.log("Ancien abonnement désabonné.");
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

                const p256dh = subscription.getKey("p256dh");
                const auth = subscription.getKey("auth");

                console.log("Clé p256dh:", p256dh ? new Uint8Array(p256dh) : "Non définie");
                console.log("Clé auth:", auth ? new Uint8Array(auth) : "Non définie");

                // Sérialisation de l'abonnement
                const serializedSubscription = serializeSubscription(subscription);
                console.log("Données sérialisées envoyées au serveur :", serializedSubscription);
    
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
            } 
            catch (err) {
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