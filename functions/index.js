// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// // Take the text parameter passed to this HTTP endpoint and insert it into the
// // Realtime Database under the path /messages/:pushId/original
// exports.addMessage = functions.region("europe-west1").https.onRequest(async (req, res) => {
//     // Grab the text parameter.
//     const original = req.query.text;
//     // Push the new message into the Realtime Database using the Firebase Admin SDK.
//     const snapshot = admin.firestore().collection('labels_collection').add({original: original});
//     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//     res.redirect(200, 'www.google.se');
// });

// Listens for new messages aded to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.sendNotification = functions.region("europe-west1").firestore.document('labels_collection/test_label1')
    .onUpdate(async (snapshot, context) => {
        // Grab the current value of what was written to the Realtime Database.
        const numHits = snapshot.before['numberOfHit'];
        console.log('Number of hits', context.params.pushId, numHits);


        // This registration token comes from the client FCM SDKs.
        var registrationToken = 'edZopte61Y0:APA91bGp-tDSFc7VHQ_WHd5FxH3SoJywc44kvPQYrP4Ie5oXpfHb-uYx_jgx1vLILm2I4LV6QINYz88RzSBIoS2A2A1QsLV4l5LEiBLePiEQJtFVpzVqUrXjmMUgeRCQXJj6JGQMufr0';

// See the "Defining the message payload" section above for details
// on how to define a message payload.
        var payload = {
            notification: {
                title: 'Yooooo!',
                body: 'Urgent action is needed to prevent your account from being disabled!'
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
    });
// exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
//     .onCreate((snapshot, context) => {
//         // Grab the current value of what was written to the Realtime Database.
//         const original = snapshot.val();
//         console.log('Uppercasing', context.params.pushId, original);
//         const uppercase = original.toUpperCase();
//         // You must return a Promise when performing asynchronous tasks inside a Functions such as
//         // writing to the Firebase Realtime Database.
//         // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
//         return snapshot.ref.parent.child('uppercase').set(uppercase);
//     });