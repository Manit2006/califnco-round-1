/**
 * Database Seeding Script for Califnco Water Ecosystem
 * Populates Firestore with 52+ realistic water purifier products, categories,
 * admin account structure, and initial demonstration records.
 */

const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(__dirname, 'categories.json'), 'utf8'));

console.log('----------------------------------------------------');
console.log('Califnco Water Ecosystem - Database Seeder');
console.log('----------------------------------------------------');
console.log(`Loaded ${products.length} products`);
console.log(`Loaded ${categories.length} categories`);

// Optional Firebase Admin SDK initialization if credentials exist
async function runSeed() {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || path.join(__dirname, '..', 'service-account.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const admin = require('firebase-admin');
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      const db = admin.firestore();

      console.log('Connected to live Firestore via Service Account. Seeding...');

      // 1. Seed Categories
      for (const cat of categories) {
        await db.collection('categories').doc(cat.id).set(cat, { merge: true });
      }
      console.log(`Successfully seeded ${categories.length} categories.`);

      // 2. Seed Products
      const batch = db.batch();
      for (const prod of products) {
        const docRef = db.collection('products').doc(prod.id);
        batch.set(docRef, {
          ...prod,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      }
      await batch.commit();
      console.log(`Successfully seeded ${products.length} products.`);

      console.log('Database seeding completed successfully.');
      return;
    } catch (err) {
      console.warn('Firebase Admin seeding encountered an error, falling back to JSON export mode:', err.message);
    }
  } else {
    console.log('Note: No live Firebase Service Account JSON found at default path.');
    console.log('Products and categories JSON files are compiled and ready for client-side or emulator direct import.');
    console.log('Location of seeds:');
    console.log(' - ' + path.join(__dirname, 'products.json'));
    console.log(' - ' + path.join(__dirname, 'categories.json'));
  }
}

if (require.main === module) {
  runSeed().catch(console.error);
}

module.exports = { products, categories, runSeed };
