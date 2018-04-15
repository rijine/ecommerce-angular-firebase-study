"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const uuid_1 = require("uuid");
const Gcs = require("@google-cloud/storage");
const Spawn = require("child-process-promise");
const path = require("path");
const os = require("os");
const fs = require("fs");
const mkdirp = require("mkdirp-promise");
// init
admin.initializeApp();
const gcs = Gcs();
const spawn = Spawn.spawn;
// constants
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
const THUMB_PREFIX = 'thumb_';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
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
exports.onImageUpload = functions.storage.object().onFinalize(object => {
    const filePath = object.name;
    const contentType = object.contentType; // This is the image MIME type
    const fileDir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);
    const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);
    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith('image/')) {
        console.log('This is not an image.');
        return null;
    }
    // Exit if the image is already a thumbnail.
    if (fileName.startsWith(THUMB_PREFIX)) {
        console.log('Already a Thumbnail.');
        return null;
    }
    // Cloud Storage files.
    const bucket = gcs.bucket(object.bucket);
    const file = bucket.file(filePath);
    const thumbFile = bucket.file(thumbFilePath);
    const metadata = {
        contentType: contentType
        // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
        // 'Cache-Control': 'public,max-age=3600',
    };
    // Create the temp directory where the storage file will be downloaded.
    return mkdirp(tempLocalDir)
        .then(() => {
        // Download file from bucket.
        return file.download({ destination: tempLocalFile });
    })
        .then(() => {
        console.log('The file has been downloaded to', tempLocalFile);
        // Generate a thumbnail using ImageMagick.
        const size = `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`;
        const imageMagickArgs = [
            tempLocalFile,
            '-thumbnail',
            size + '^',
            '-gravity',
            'center',
            '-extent',
            size,
            tempLocalThumbFile
        ];
        /* const imageMagickArgs = [
          tempLocalFile,
          '-thumbnail',
          `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
          tempLocalThumbFile
        ]; */
        return spawn('convert', imageMagickArgs, { capture: ['stdout', 'stderr'] });
    })
        .then(() => {
        console.log('Thumbnail created at', tempLocalThumbFile);
        // Uploading the Thumbnail.
        return bucket.upload(tempLocalThumbFile, {
            destination: thumbFilePath,
            metadata: metadata
        });
    })
        .then(() => {
        console.log('Thumbnail uploaded to Storage at', thumbFilePath);
        // Once the image has been uploaded delete the local files to free up disk space.
        fs.unlinkSync(tempLocalFile);
        fs.unlinkSync(tempLocalThumbFile);
        // Get the Signed URLs for the thumbnail and original image.
        const config = {
            action: 'read',
            expires: '03-01-2500'
        };
        return Promise.all([
            thumbFile.getSignedUrl(config),
            file.getSignedUrl(config)
        ]);
    }) /* .then((results) => {
    console.log('Got Signed URLs.');
    const thumbResult = results[0];
    const originalResult = results[1];
    const thumbFileUrl = thumbResult[0];
    const fileUrl = originalResult[0];
    // Add the URLs to the Database
    return admin.database().ref('images').push({path: fileUrl, thumbnail: thumbFileUrl});
  }) */
        .then(() => console.log('Thumbnail URLs saved to database.'));
});
//# sourceMappingURL=index.js.map