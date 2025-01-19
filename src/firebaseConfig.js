import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAJ_keM_VN1DLQzGsYwX_IkA54xVkJ0SKs",
    authDomain: "test1-64c96.firebaseapp.com",
    projectId: "test1-64c96",
    storageBucket: "test1-64c96.firebasestorage.app",
    messagingSenderId: "534622430624",
    appId: "1:534622430624:web:0c19d50b0cde6aade4f0c5",
    measurementId: "G-C6GVLG0MX8",
    databaseURL: "https://test1-64c96-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;
