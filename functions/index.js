// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const fieldFilter = require('./fieldFilter');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
var serviceAccount = require("../button-app-2-6ac1c850c51b.json");
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

admin.initializeApp(
    {
        credential: admin.credential.cert(serviceAccount),
        //databaseURL: "https://******.firebaseio.com"}
        databaseURL: "http://localhost:8080"
    }
);
let db = admin.firestore();
let data = {
    numberOfHit: 3,
    something:2
};
db.collection("labels_collection").doc("test_label1").set(data);

//sendNotification({before: {numberOfHit: 3}, numberOfHit: 4 })
exports.addMessage = functions.region("europe-west1").https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    const snapshot = admin.firestore().collection('labels_collection').doc("test_label1").set({numberOfHit: 5});
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(200, 'www.google.se');
});


// Listens for new messages aded to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.sendNotification = functions.region("europe-west1").firestore.document('labels_collection/test_label1')
    .onUpdate(fieldFilter.field('numberOfHit', 'CHANGED', async (change, context) => {
        // Grab the current value of what was written to the Realtime Database.
        const numHits = change.after.data().numberOfHit;

        console.log('Number of hits', context.params.pushId, numHits);

        // This registration token comes from the client FCM SDKs.
        var registrationToken = 'e6WCepJgaE8:APA91bHZ8yg5hU0rjAfo8Gy-qV6Zir1ivrcc6GBYccBFBdRXW8rN5uc3OmYBBJu6WxKHL4J_fTYrS6VrmwrKWHw1jfoAusOA5uxKRdYezsfhNXoNXLRaF7NIihwIFXhexRNlCxtj5_c5';

        // See the "Defining the message payload" section above for details
        // on how to define a message payload.
        var payload = {
            notification: {
                title: 'Hi, I am here to notify you...',
                body: '...that you hit the button ' + numHits + ' times'
            }
        };

        // Set the message as high priority and have it expire after 24 hours.
        var options = {
            priority: 'high',
            timeToLive: 60 * 60 * 24
        };

        // Send a message to the device corresponding to the provided
        // registration token with the provided options.
        let status = -1;
        admin.messaging().sendToDevice(registrationToken, payload, options)
            .then(function (response) {
                console.log('Successfully sent message:', response);
                status = 0;
            })
            .catch(function (error) {
                console.log('Error sending message:', error);
                status = 1;
            });

        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
        // return snapshot.({'uppercase': uppercase});
        return "status is" + status;
    }));
