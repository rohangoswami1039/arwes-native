# arwes-native
Expo React Native Social Media Software 

Required:--
    1. Node js 
    2. Expo 
    3. Firebase (node package)

For Using arwes Create a firebase Account in firebase console and start a web project

1. Create firebase.js file in root folder of the app 
2. copy your firebase web config file in firebase.js 
3. Import Intialize App from firebase and create a varialbe using initalize app function and pass the config variable in the function { const app=initializeApp(firebaseConfig) } 
4. Initalize  db = getFirestore(app), auth = getAuth(app), storage = getStorage(app) same as above
5. Export all the variable 
