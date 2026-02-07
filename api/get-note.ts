import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, auth } from './_firebase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Missing Authorization header' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const companyId = req.query.companyId as string;

    if (!companyId || typeof companyId !== 'string') {
        return res.status(400).json({ error: 'Bad Request', message: 'companyId is required and must be a string' });
    }

    try {
        // 1. Verify the ID Token
        const decodedToken = await auth.verifyIdToken(idToken);
        const { uid } = decodedToken;

        // 2. Find user document
        const usersRef = db.collection('users');
        const querySnapshot = await usersRef.where('authUid', '==', uid).limit(1).get();

        if (querySnapshot.empty) {
            return res.status(404).json({ error: 'Not Found', message: 'User profile not found' });
        }

        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;

        // 3. Find note for user and company
        const notesRef = db.collection('user_company_note');
        const noteQuery = await notesRef
            .where('user_id', '==', userId)
            .where('company_id', '==', companyId)
            .limit(1)
            .get();

        if (!noteQuery.empty) {
            const noteDoc = noteQuery.docs[0];
            const noteData = noteDoc.data();
            return res.status(200).json({
                success: true,
                data: {
                    id: noteDoc.id,
                    user_id: noteData.user_id,
                    company_id: noteData.company_id,
                    note: noteData.note,
                    created_at: noteData.created_at,
                    updated_at: noteData.updated_at,
                },
            });
        } else {
            return res.status(200).json({ success: true, data: null });
        }
    } catch (error) {
        console.error('Error fetching note:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch note' });
    }
}
