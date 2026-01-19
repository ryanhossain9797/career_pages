import { Firestore, Timestamp } from 'firebase-admin/firestore';
import { Adapter, AdapterSession, AdapterUser, VerificationToken } from 'better-auth/adapters';

export const firestoreAdapter = (db: Firestore): Adapter => {
    const Users = db.collection("users");
    const Sessions = db.collection("sessions");
    const Accounts = db.collection("accounts");
    const VerificationTokens = db.collection("verification_tokens");
    return {
        id: "firestore-custom",
        async createUser(user) {
            const { id } = await Users.add(user);
            const newUser = await Users.doc(id).get();
            return { ...newUser.data(), id } as AdapterUser
        },
        async getUser(id) {
            const user = await Users.doc(id).get();
            if (!user.exists) return null;
            return { ...user.data(), id: user.id } as AdapterUser;
        },
        async getUserByEmail(email) {
            const snapshot = await Users.where("email", "==", email).limit(1).get();
            if (snapshot.empty) return null;
            const user = snapshot.docs[0];
            return { ...user.data(), id: user.id } as AdapterUser;
        },
        async getUserByAccount({ providerAccountId, provider }) {
            const snapshot = await Accounts.where("providerAccountId", "==", providerAccountId).where("provider", "==", provider).limit(1).get();
            if (snapshot.empty) return null;
            const account = snapshot.docs[0];
            const user = await Users.doc(account.data().userId).get();
            return { ...user.data(), id: user.id } as AdapterUser;
        },
        async updateUser(user) {
            await Users.doc(user.id).set(user);
            const newUser = await Users.doc(user.id).get();
            return { ...newUser.data(), id: newUser.id } as AdapterUser
        },
        async deleteUser(userId) {
            await Users.doc(userId).delete();
        },
        async linkAccount(account) {
            const { id } = await Accounts.add(account);
            const newAccount = await Accounts.doc(id).get();
            return newAccount.data() as any;
        },
        async unlinkAccount({ providerAccountId, provider }) {
            const snapshot = await Accounts.where("providerAccountId", "==", providerAccountId).where("provider", "==", provider).limit(1).get();
            if (snapshot.empty) return;
            const account = snapshot.docs[0];
            await Accounts.doc(account.id).delete();
        },
        async createSession(session) {
            const { id } = await Sessions.add(session);
            const newSession = await Sessions.doc(id).get();
            return newSession.data() as AdapterSession;
        },
        async getSessionAndUser(sessionToken) {
            const snapshot = await Sessions.where("sessionToken", "==", sessionToken).limit(1).get();

            if (snapshot.empty) return null;

            const session = snapshot.docs[0].data() as AdapterSession;

            const user = await Users.doc(session.userId).get();

            return { session, user: { ...user.data(), id: user.id } as AdapterUser };

        },
        async updateSession(session) {
            const snapshot = await Sessions.where("sessionToken", "==", session.sessionToken).limit(1).get();
            if (snapshot.empty) return null as any;
            const sessionDoc = snapshot.docs[0];
            await Sessions.doc(sessionDoc.id).set(session);
            const newSession = await Sessions.doc(sessionDoc.id).get();
            return newSession.data() as AdapterSession;
        },
        async deleteSession(sessionToken) {
            const snapshot = await Sessions.where("sessionToken", "==", sessionToken).limit(1).get();
            if (snapshot.empty) return;
            const session = snapshot.docs[0];
            await Sessions.doc(session.id).delete();
        },
        async createVerificationToken(token) {
            const { id } = await VerificationTokens.add({ ...token, expires: Timestamp.fromDate(token.expires) });
            const newToken = await VerificationTokens.doc(id).get();
            return newToken.data() as any;
        },
        async useVerificationToken({ identifier, token }) {
            const snapshot = await VerificationTokens.where("identifier", "==", identifier).where("token", "==", token).limit(1).get();
            if (snapshot.empty) return null;
            const verificationToken = snapshot.docs[0];
            await VerificationTokens.doc(verificationToken.id).delete();
            const data = verificationToken.data();
            return { ...data, expires: (data.expires as Timestamp).toDate() } as VerificationToken;
        }
    }
};
