// import { getAuth } from 'firebase-admin/auth';
// import { getFirestore } from 'firebase-admin/firestore';
// import { getMessaging } from 'firebase-admin/messaging';
// import { initializeApp, cert, getApp, getApps } from 'firebase-admin/app';

// export function getFirebaseApp() {
// 	if (getApps()?.length > 0) return getApp();
// 	return initializeApp({
// 		credential: cert('./service-account.json'),
// 	});
// }

// export const firebase = getFirebaseApp();
// export const auth = getAuth(firebase);
// export const firestore = getFirestore(firebase);
// export const messaging = getMessaging(firebase);
