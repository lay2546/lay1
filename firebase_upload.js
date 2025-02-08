import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDPNcrB-EKgJo6942fc5TFigtCZsGFOwTY",
  authDomain: "lay1-56dde.firebaseapp.com",
  databaseURL: "https://lay1-56dde-default-rtdb.firebaseio.com",
  projectId: "lay1-56dde",
  storageBucket: "lay1-56dde.firebasestorage.app",
  messagingSenderId: "97065714920",
  appId: "1:97065714920:web:28a1c69ed5543d80c8f55d",
  measurementId: "G-LTDEG1LRVM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

async function uploadLibraryData(name, htmlFile, cssFile, imageFile) {
    if (!name || !htmlFile || !cssFile || !imageFile) {
        alert("กรุณาเลือกไฟล์ให้ครบ (HTML, CSS, รูปภาพ)");
        return;
    }

    try {
        // ✅ อัปโหลดไฟล์ HTML
        const htmlFileName = Date.now() + '-' + htmlFile.name;
        const htmlStorageRef = ref(storage, "libraries/html/" + htmlFileName);
        await uploadBytes(htmlStorageRef, htmlFile);
        const htmlUrl = await getDownloadURL(htmlStorageRef);

        // ✅ อัปโหลดไฟล์ CSS
        const cssFileName = Date.now() + '-' + cssFile.name;
        const cssStorageRef = ref(storage, "libraries/css/" + cssFileName);
        await uploadBytes(cssStorageRef, cssFile);
        const cssUrl = await getDownloadURL(cssStorageRef);

        // ✅ อัปโหลดไฟล์รูปภาพ
        const imageFileName = Date.now() + '-' + imageFile.name;
        const imageStorageRef = ref(storage, "libraries/images/" + imageFileName);
        await uploadBytes(imageStorageRef, imageFile);
        const imageUrl = await getDownloadURL(imageStorageRef);

        // ✅ เพิ่มข้อมูลลง Firestore
        await addDoc(collection(db, "libraries"), {
            name,
            htmlUrl,
            cssUrl,
            imageUrl,
            createdAt: serverTimestamp()
        });

        alert("เพิ่มห้องสมุดเรียบร้อย!");
        location.reload();
    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        alert("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
    }
}

async function listUploadedFiles() {
    const filesList = document.getElementById("files-list");
    filesList.innerHTML = "";

    try {
        const storageRef = ref(storage, "libraries/");
        const result = await listAll(storageRef);

        result.items.forEach(async (fileRef) => {
            const fileUrl = await getDownloadURL(fileRef);
            const listItem = document.createElement("li");
            listItem.innerHTML = `<a href="${fileUrl}" target="_blank">${fileRef.name}</a>`;
            filesList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching files:", error);
    }
}

export { uploadLibraryData, listUploadedFiles };
