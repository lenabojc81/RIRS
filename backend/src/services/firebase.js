import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

let firebaseApp;
let auth;
let firestore;

// Initialize Firebase Admin
try {
    if (!admin.apps.length) {
        // Check if we have the required environment variables
        const {
            FIREBASE_PROJECT_ID,
            FIREBASE_PRIVATE_KEY_ID,
            FIREBASE_PRIVATE_KEY,
            FIREBASE_CLIENT_EMAIL,
            FIREBASE_CLIENT_ID
        } = process.env;

        if (FIREBASE_PROJECT_ID && FIREBASE_PRIVATE_KEY && FIREBASE_CLIENT_EMAIL) {
            // Use real Firebase Admin SDK with service account
            const serviceAccount = {
                type: "service_account",
                project_id: FIREBASE_PROJECT_ID,
                private_key_id: FIREBASE_PRIVATE_KEY_ID,
                private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle escaped newlines
                client_email: FIREBASE_CLIENT_EMAIL,
                client_id: FIREBASE_CLIENT_ID,
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                universe_domain: "googleapis.com"
            };
            
            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: FIREBASE_PROJECT_ID
            });
            
            console.log('✅ Firebase Admin SDK initialized successfully with service account');
        } else {
            console.log('❌ Missing Firebase Admin SDK credentials in .env file');
            console.log('Required variables:');
            console.log('- FIREBASE_PROJECT_ID:', !!FIREBASE_PROJECT_ID);
            console.log('- FIREBASE_PRIVATE_KEY:', !!FIREBASE_PRIVATE_KEY);
            console.log('- FIREBASE_CLIENT_EMAIL:', !!FIREBASE_CLIENT_EMAIL);
            console.log('Please add the missing credentials to your .env file');
            throw new Error('Missing Firebase credentials');
        }
    }

    // Initialize auth and firestore services
    auth = admin.auth();
    firestore = admin.firestore();

} catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    console.log('\n🔧 To fix this:');
    console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
    console.log('2. Select your project: transactiontracker-d9b00');
    console.log('3. Go to Project Settings → Service accounts');
    console.log('4. Click "Generate new private key"');
    console.log('5. Download the JSON file');
    console.log('6. Add the credentials to your .env file\n');
    
    // Exit the process since we can't continue without Firebase
    process.exit(1);
}

export { auth, firestore, firebaseApp };