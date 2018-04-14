"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const uuid_1 = require("uuid");
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
/* exports.sendUpdate = functions.firestore
  .document('/registrations')
  .onWrite(event => {
    const beforeData = event.data.previous.data(); // data before the write
    const afterData = event.data.data(); // data after the write
    return admin
      .firestore()
      .doc('/registrations/' + event.eventId)
      .set({ event })
      .then(() => {
        console.log('Updated');
      });

  }); */
exports.OnRegistration = functions.firestore
    .document('/registrations/{email}')
    .onWrite((change, context) => {
    const beforeData = change.before.data(); // data before the write
    const afterData = change.after.data(); // data after the write
    console.log('Data ' +
        JSON.stringify(context.params) +
        JSON.stringify(beforeData) +
        JSON.stringify(afterData));
    return admin
        .firestore()
        .doc('/activations/' + context.params.email)
        .set({ code: uuid_1.v4(), status: 1, pwd: afterData.pwd })
        .then(() => {
        console.log('Activation email sent');
    });
});
exports.OnActivation = functions.firestore
    .document('/activations/{email}')
    .onUpdate((change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    console.log('Data ' +
        JSON.stringify(context.params) +
        JSON.stringify(beforeData) +
        JSON.stringify(afterData));
    return admin
        .auth()
        .createUser({ email: context.params.email, password: beforeData.pwd })
        .then(() => {
        console.log('User created');
    });
});
//# sourceMappingURL=index.js.map