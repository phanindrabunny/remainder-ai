import { saveSubscription } from './api';

const PUBLIC_VAPID_KEY = process.env.REACT_APP_VAPID_PUBLIC; // set in .env

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/'); // ✅ removed unnecessary escape
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeUser(userEmail) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });

    // send subscription to backend
    await saveSubscription(subscription, userEmail);
    return subscription;
  } catch (err) {
    console.error('Subscription failed', err);
    return null;
  }
}
