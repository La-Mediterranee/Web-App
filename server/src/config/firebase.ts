import * as firebase from 'firebase-admin';

firebase.initializeApp();

export const db = firebase.firestore();
export const auth = firebase.auth();
