// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  firebase: {
    projectId: 'lra-auth',
    appId: '1:621004275901:web:d97ec13b6134d71e4077d4',
    storageBucket: 'lra-auth.appspot.com',
    apiKey: 'AIzaSyD7inpSsiNofde0sP4yLleFs8tFSlwCaMM',
    authDomain: 'lra-auth.firebaseapp.com',
    messagingSenderId: '621004275901',
  },
  production: false
};
