import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './_firebase.js';

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
