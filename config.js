import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";



const firebaseConfig = {
    apiKey: "AIzaSyBAIBQ0VBIsCDMSoLty4P1O9D0UTChNy9c",
    authDomain: "todo-app-946c5.firebaseapp.com",
    projectId: "todo-app-946c5",
    storageBucket: "todo-app-946c5.appspot.com",
    messagingSenderId: "326849565463",
    appId: "1:326849565463:web:5679d61e896b61e3aadd52",
    measurementId: "G-6M2S8S72Z9"
  };
  
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);



