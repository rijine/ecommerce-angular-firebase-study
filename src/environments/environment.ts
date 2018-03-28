// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAaPXufaWhSXz73GWzuNERRJx7zNuK29fo',
    authDomain: 'ecommerce-angular-firebase.firebaseapp.com',
    databaseURL: 'https://ecommerce-angular-firebase.firebaseio.com',
    projectId: 'ecommerce-angular-firebase',
    storageBucket: 'ecommerce-angular-firebase.appspot.com',
    messagingSenderId: '739633781630'
  }
};
