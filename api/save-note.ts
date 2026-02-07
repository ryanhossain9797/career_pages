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

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Missing Authorization header' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        // 1. Verify the ID Token
        const decodedToken = await auth.verifyIdToken(idToken);
        const { uid } = decodedToken;

        // 2. Get company ID and note from request body
        const { companyId, note } = req.body;
        if (!companyId || typeof companyId !== 'string') {
            return res.status(400).json({ error: 'Bad Request', message: 'companyId is required and must be a string' });
        }
        if (!note || typeof note !== 'string') {
            return res.status(400).json({ error: 'Bad Request', message: 'note is required and must be a string' });
        }

        // 3. Find user document
        const usersRef = db.collection('users');
        const querySnapshot = await usersRef.where('authUid', '==', uid).limit(1).get();

        if (querySnapshot.empty) {
            return res.status(404).json({ error: 'Not Found', message: 'User profile not found' });
        }

        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;

        // 4. Check if a note already exists for this user and company
        const notesRef = db.collection('user_company_note');
        const existingNoteQuery = await notesRef
            .where('user_id', '==', userId)
            .where('company_id', '==', companyId)
            .limit(1)
            .get();

        if (!existingNoteQuery.empty) {
            // Update existing note
            const noteDoc = existingNoteQuery.docs[0];
            await notesRef.doc(noteDoc.id).update({
                note: note,
                updated_at: new Date(),
            });
            return res.status(200).json({ success: true, message: 'Note updated successfully' });
        } else {
            // Create new note
            await notesRef.add({
                user_id: userId,
                company_id: companyId,
                note: note,
                created_at: new Date(),
                updated_at: new Date(),
            });
            return res.status(200).json({ success: true, message: 'Note saved successfully' });
        }
    } catch (error) {
        console.error('Error saving note:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to save note' });
    }
}
