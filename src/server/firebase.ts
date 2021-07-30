import admin from 'firebase-admin';

export function getFirebaseApp() {
	if (admin.apps?.length > 0) return admin.app();
	return admin.initializeApp({
		credential: admin.credential?.cert('./service-account.json'),
	});
}

export const firebase = getFirebaseApp();
export const auth = firebase?.auth();
