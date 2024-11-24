import { useState } from "react";

// fichier frontend/src/App.js

function App() {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const serverUrl = 
    window.location.origin.includes('localhost') 
        ? 'http://localhost:5000'  
        : '/.netlify/functions';  

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

            console.log('Nouvel abonnement:', subscription);
            
             // Convertir l'ArrayBuffer de applicationServerKey en une chaîne base64
        const applicationServerKey = btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.options.applicationServerKey)));

        // Sérialiser l'abonnement en envoyant uniquement les propriétés nécessaires
        const subscriptionData = {
            endpoint: subscription.endpoint,
            keys: {
                p256dh: subscription.getKey('p256dh'),
                auth: subscription.getKey('auth'),
                applicationServerKey: applicationServerKey, // Inclure la clé convertie
            },
        };

        console.log('Abonnement sérialisé:', subscriptionData);  // Vérifier ce qui est envoyé

        // Enregistrer le nouvel abonnement
        const subscriptionResponse = await fetch(`${serverUrl}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscriptionData),  // Envoi des données sérialisées
        });

        if (!subscriptionResponse.ok) {
            throw new Error('Impossible d\'enregistrer l\'abonnement');
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