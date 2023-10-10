## ReadMe

### h3. Running

Need to add API keys to:
/frontend/src/config/firebase.js
/frontend/src/config/firebaseConfig.json
/sockets/src/config/firebase.js

For development:

Frontend: Go to frontend. Run `yarn start`

Backend: Go to sockets. Run `yarn server`, `yarn serverShortTimers`, or `yarn serverSuperShortTimers`. The latter two divide the amount of time the timers run for by 5-25x less.

You can run them both together with pm2. It sometimes got a bit buggy I believe so I went back to separately running them.

The logs for the backend are located at sockets/logs/g-app.log

--

For production:

Mistakenly made this based on using Google Cloud/Firebase. I don't think there's any way to not pay too much for Google Cloud Run when sockets are needed (persistant connections). Either all of this goes to Google Cloud or some changes with Firebase config/setting up may be needed and host it any where.

Goal will be to move to Supabase and having more instructions in general.

  Google Cloud:
  Install Firebase CLI
  npm install -g firebase-tools 
  Or can use Homebrew or other package managers

  in /frontend/
  `firebase login`
  don't do `firebase init`
  `yarn build`
  `firebase deploy`

  in /sockets/
  Some initial commands:
  `gcloud init`
  `gcloud auth list`
  `gcloud config list`
  https://cloud.google.com/sdk/docs/install-sdk

  `gcloud config set account ACCOUNT`
  `gcloud config set project PROJECT_ID`
  `gcloud app deploy`

--

Using Cloud Logging in Firebase too
https://console.firebase.google.com/u/0/project/collab-timers-z/settings/integrations/cloudlogging

### h3. Testing

To run Cypress tests locally, first run the server (located in ../sockets).

Then the frontend app:
```shell
$ yarn start
```

Then finally run Cypress:
```shell
$ yarn run cypress:open
```

And then run `smoke-test.js`