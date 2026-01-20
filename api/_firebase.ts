import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const apps = getApps();

if (!apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
        console.error('Missing Firebase environment variables');
    } else {
        try {
            initializeApp({
                credential: cert({
                    projectId,
                    clientEmail,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                }),
            });
            console.log('Firebase Admin initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Firebase Admin:', error);
        }
    }
}

export const db = getFirestore();
export const auth = getAuth();
