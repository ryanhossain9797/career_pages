import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
const apps = getApps();
if (!apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
        console.error('Missing Firebase environment variables:', {
            projectId: !!projectId,
            clientEmail: !!clientEmail,
            privateKey: !!privateKey
        });
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

const db = getFirestore();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Fetch all collections in parallel
        const [companiesSnap, tagsSnap, boardsSnap] = await Promise.all([
            db.collection('companies').get(),
            db.collection('tags').get(),
            db.collection('boards').get()
        ]);

        const data = {
            companies: companiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
            tags: tagsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
            boards: boardsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        };

        res.status(200).json(data);
    } catch (error: any) {
        console.error('Error fetching data from Firestore:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
