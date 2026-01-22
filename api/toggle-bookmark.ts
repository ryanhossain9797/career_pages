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

        // 2. Get company ID and desired bookmark state from request body
        const { companyId, bookmarked } = req.body;
        if (!companyId || typeof companyId !== 'string') {
            return res.status(400).json({ error: 'Bad Request', message: 'companyId is required and must be a string' });
        }
        if (typeof bookmarked !== 'boolean') {
            return res.status(400).json({ error: 'Bad Request', message: 'bookmarked is required and must be a boolean' });
        }

        // 3. Find user document
        const usersRef = db.collection('users');
        const querySnapshot = await usersRef.where('authUid', '==', uid).limit(1).get();

        if (querySnapshot.empty) {
            return res.status(404).json({ error: 'Not Found', message: 'User profile not found' });
        }

        const userDoc = querySnapshot.docs[0];
        const userDocRef = usersRef.doc(userDoc.id);
        const userData = userDoc.data();

        // 4. Get current bookmarkedCompanies array (fail-safe)
        let bookmarkedCompanies: string[] = userData.bookmarkedCompanies || [];

        // 5. Set bookmark based on desired state
        if (bookmarked) {
            // Add bookmark if not already present
            if (!bookmarkedCompanies.includes(companyId)) {
                bookmarkedCompanies = [...bookmarkedCompanies, companyId];
            }
        } else {
            // Remove bookmark
            bookmarkedCompanies = bookmarkedCompanies.filter(id => id !== companyId);
        }

        // 6. Update Firestore
        await userDocRef.update({
            bookmarkedCompanies
        });

        // 7. Return updated bookmarks
        res.status(200).json({ bookmarkedCompanies });
    } catch (error: any) {
        console.error('Error in toggle-bookmark:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
