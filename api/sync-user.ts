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
        const { uid, email, name, picture } = decodedToken;

        const usersRef = db.collection('users');
        const querySnapshot = await usersRef.where('authUid', '==', uid).limit(1).get();

        let profile;
        const now = new Date().toISOString();

        if (!querySnapshot.empty) {
            // User exists, update last login
            const userDoc = querySnapshot.docs[0];
            const userDocRef = usersRef.doc(userDoc.id);
            const userData = userDoc.data();

            // Ensure bookmarkedCompanies exists (fail-safe for existing users)
            const updateData: any = {
                lastLogin: now,
                // Optionally sync displayName/email if they changed in Google
                email: email || userData.email,
                displayName: name || userData.displayName
            };

            if (!userData.bookmarkedCompanies) {
                updateData.bookmarkedCompanies = [];
            }

            await userDocRef.update(updateData);

            // Fetch company_ids that have notes for this user
            const notesSnapshot = await db.collection('user_company_note')
                .where('user_id', '==', userDoc.id)
                .get();
            const noteCompanyIds = notesSnapshot.docs.map(doc => doc.data().company_id);

            profile = {
                ...userData,
                ...updateData,
                id: userDoc.id,
                noteCompanyIds
            };
        } else {
            // New user, create profile
            const newProfileData = {
                authUid: uid,
                email: email || null,
                displayName: name || null,
                createdAt: now,
                lastLogin: now,
                bookmarkedCompanies: []
            };

            const docRef = await usersRef.add(newProfileData);
            profile = {
                ...newProfileData,
                id: docRef.id,
                noteCompanyIds: []
            };
        }

        res.status(200).json(profile);
    } catch (error: any) {
        console.error('Error in sync-user:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
