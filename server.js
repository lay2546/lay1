const express = require('express');
const mysql = require('mysql2');
const app = express();

// ใช้ JSON Body Parsing Middleware
app.use(express.json());

// เชื่อมต่อกับ MySQL Database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // เปลี่ยนตามการตั้งค่าของคุณ
  password: '',
  database: 'activity_db', // ชื่อฐานข้อมูล
});

db.connect(err => {
  if (err) {
    console.error('ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้:', err);
    return;
  }
  console.log('เชื่อมต่อกับฐานข้อมูล MySQL สำเร็จ');
});

// API สำหรับดึงข้อมูลกิจกรรมทั้งหมด
app.get('/activities', (req, res) => {
  db.query('SELECT * FROM activities', (err, results) => {
    if (err) {
      res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลกิจกรรมได้' });
      return;
    }
    res.json(results);
  });
});

// API สำหรับเพิ่มกิจกรรมใหม่
app.post('/activities', (req, res) => {
  const { title, category, location, description } = req.body;
  const query = 'INSERT INTO activities (title, category, location, description) VALUES (?, ?, ?, ?)';
  db.query(query, [title, category, location, description], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'ไม่สามารถบันทึกกิจกรรมได้' });
      return;
    }
    res.status(201).json({ message: 'เพิ่มกิจกรรมสำเร็จ', id: result.insertId });
  });
});

// API สำหรับแก้ไขกิจกรรม
app.put('/activities/:id', (req, res) => {
  const { title, category, location, description } = req.body;
  const { id } = req.params;
  const query = 'UPDATE activities SET title = ?, category = ?, location = ?, description = ? WHERE id = ?';
  db.query(query, [title, category, location, description, id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'ไม่สามารถแก้ไขกิจกรรมได้' });
      return;
    }
    res.json({ message: 'แก้ไขกิจกรรมสำเร็จ' });
  });
});

// API สำหรับลบกิจกรรม
app.delete('/activities/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM activities WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'ไม่สามารถลบกิจกรรมได้' });
      return;
    }
    res.json({ message: 'ลบกิจกรรมสำเร็จ' });
  });
});

// เริ่มต้นเซิร์ฟเวอร์ที่พอร์ต 3000
app.listen(3000, () => {
  console.log('เซิร์ฟเวอร์กำลังทำงานที่ http://localhost:3000');
});
