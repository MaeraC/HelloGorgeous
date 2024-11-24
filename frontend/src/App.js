import { useState } from "react";

function App() {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

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
        const response = await fetch('http://localhost:5000/vapidPublicKey');
        const { publicKey } = await response.json();
        
        // S'abonner à la nouvelle clé publique
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicKey,
        });
        
        // Enregistrer le nouvel abonnement
        await fetch('http://localhost:5000/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription),
        });
        
            setSuccess('Notifications activées avec succès !');
        } 
        else {
          setError('Votre navigateur ne supporte pas les notifications push.');
        }
    };

    return (
        <div>
            <h1>Hello Gorgeous!</h1>
            <p>Active les notifications pour recevoir ton rappel quotidien.</p>
            <button onClick={subscribeToPush}>Activer les notifications</button>
            {error && <p style={{color: "red"}}>{error}</p>}
            {success && <p style={{color: "green"}}>{success}</p>}
        </div>
    )
}

export default App