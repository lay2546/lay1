// นำเข้า Firebase
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// กำหนดค่า Firebase Config (ใส่ค่าจริงจาก Firebase Console)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// เริ่มต้น Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ฟังก์ชันล็อกอิน
function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("เข้าสู่ระบบสำเร็จ:", userCredential.user);
        })
        .catch((error) => {
            console.error("เกิดข้อผิดพลาด:", error.message);
        });
}

// เรียกใช้งานฟังก์ชันล็อกอิน
login("test@example.com", "password123");
