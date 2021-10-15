import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//GET Below Settings from Firebase > Project Overview > Settings > General > Your apps > Firebase SDK snippet > Config
const firebaseConfig = {
  apiKey: "AIzaSyD_K4upT4VNz6vclFtaLl6lA7TybFo06wU",
  authDomain: "whatsapp-clone-485a9.firebaseapp.com",
  projectId: "whatsapp-clone-485a9",
  storageBucket: "whatsapp-clone-485a9.appspot.com",
  messagingSenderId: "12745011839",
  appId: "1:12745011839:web:57015eff0ab3a9d757454a",
  measurementId: "G-63GP1MLPD9",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
