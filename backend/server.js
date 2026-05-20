const express = require('express');
const mysql   = require('mysql2');
const cors    = require('cors');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { execSync } = require('child_process');

const app = express();
app.use(express.json());
app.use(cors());

// ── Connexion MariaDB (pool = reconnexion automatique) ─────
const db = mysql.createPool({
  host: 'db', port: 3306,
  user: 'root', password: 'rootpassword', database: 'ctf_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
db.getConnection((err, conn) => {
  if (err) console.error('Erreur BDD:', err);
  else { console.log('[+] Connecté à MariaDB'); conn.release(); }
});

// ── Upload ─────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '/app/uploads/'),
  filename:    (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// ══════════════════════════════════════════════════════════
// ÉTAPE 1 — SQLi
// Payload : admin' OR '1'='1' -- -
// ══════════════════════════════════════════════════════════
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM employees WHERE username = '${username}' AND password = '${password}'`;
  console.log('[SQLi] Requête:', query);
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erreur SQL: ' + err.message });
    if (results.length > 0) {
      db.query("SELECT flag FROM flags WHERE step='sqli'", (e, rows) => {
        const flag = rows && rows[0] ? rows[0].flag : 'FLAG{STEP1_SQLi_Auth_Bypass}';
        return res.json({ success: true, flag, user: results[0].username });
      });
    } else {
      return res.json({ success: false, message: 'Identifiants incorrects.' });
    }
  });
});

// ══════════════════════════════════════════════════════════
// ÉTAPE 2 — File Upload
// Vérifie uniquement l'extension (bypassable en renommant)
// ══════════════════════════════════════════════════════════
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Aucun fichier.' });

  const ext = path.extname(req.file.originalname).toLowerCase();
  if (!['.jpg', '.png', '.gif'].includes(ext)) {
    // Supprime le fichier refusé
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ success: false, message: '❌ Only images allowed (.jpg, .png, .gif)' });
  }

  console.log('[Upload] Fichier reçu:', req.file.originalname);
  db.query("SELECT flag FROM flags WHERE step='upload'", (e, rows) => {
    const flag = rows && rows[0] ? rows[0].flag : 'FLAG{STEP2_FileUpload_Webshell}';
    return res.json({
      success: true,
      message: `Fichier "${req.file.originalname}" uploadé avec succès.`,
      path: `/uploads/${req.file.originalname}`,
      flag
    });
  });
});

// ══════════════════════════════════════════════════════════
// ÉTAPE 3 — RCE
// Le flag est caché dans /secret/flag.txt
// ══════════════════════════════════════════════════════════
app.get('/exec', (req, res) => {
  const file = req.query.file;
  if (!file) return res.status(400).json({ success: false, message: 'Paramètre ?file= manquant.' });

  const filepath = path.join('/app/uploads', file);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ success: false, message: `Fichier "${file}" introuvable dans /uploads/.` });
  }

  try {
    const result = execSync(`node ${filepath}`, { timeout: 3000 }).toString().trim();
    if (!result) {
      return res.json({ success: true, output: "(aucun output)" });
    }
    const flagContent = fs.readFileSync('/secret/flag.txt', 'utf8').trim();
    if (result.includes(flagContent)) {
      return res.json({ success: true, output: result, flag: flagContent });
    }
    return res.json({ success: true, output: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur exécution: ' + err.message });
  }
});

app.listen(5000, () => console.log('[+] Backend MegaCorp démarré sur le port 5000'));