import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPNcrB-EKgJo6942fc5TFigtCZsGFOwTY",
  authDomain: "lay1-56dde.firebaseapp.com",
  projectId: "lay1-56dde",
  storageBucket: "lay1-56dde.firebasestorage.app",
  messagingSenderId: "97065714920",
  appId: "1:97065714920:web:28a1c69ed5543d80c8f55d",
  measurementId: "G-LTDEG1LRVM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Sign-up functionality
document.getElementById("create-acct-btn").addEventListener("click", function() {
  const email = document.getElementById("email-signup").value.trim();
  const confirmEmail = document.getElementById("confirm-email-signup").value.trim();
  const password = document.getElementById("password-signup").value.trim();
  const confirmPassword = document.getElementById("confirm-password-signup").value.trim();

  // Validate email and password
  if (email !== confirmEmail) {
    alert("อีเมลไม่ตรงกัน");
    return;
  }

  if (password !== confirmPassword) {
    alert("รหัสผ่านไม่ตรงกัน");
    return;
  }

  // Create account
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Store user information in Firebase Database (no password stored)
      set(ref(db, 'users/' + user.uid), {
        username: email,
        email: email,
        createdAt: new Date().toISOString(),
      })
      .then(() => {
        alert("สมัครสมาชิกสำเร็จ!");
        window.location.href = "หน้าแรก.html"; // Redirect to homepage after registration
      })
      .catch((error) => {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้ใช้: " + error.message);
      });
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        alert("อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น");
      } else {
        alert("เกิดข้อผิดพลาดในการสมัครสมาชิก: " + error.message);
      }
    });
});

// Login functionality
document.getElementById("submit").addEventListener("click", function() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("เข้าสู่ระบบสำเร็จ!");
      window.location.href = "หน้าแรก.html"; // Redirect to homepage after successful login
    })
    .catch((error) => {
      alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ: " + error.message);
    });
});

// Switch between login and signup forms
document.getElementById("sign-up").addEventListener("click", function() {
  document.getElementById("main").style.display = "none";
  document.getElementById("create-acct").style.display = "block";
});
