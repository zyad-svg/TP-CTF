CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'employee'
);

INSERT INTO employees (username, password, role) VALUES
('admin', 'MegaC0rp_S3cr3t!', 'admin'),
('john.doe', 'john123', 'employee'),
('jane.smith', 'jane456', 'employee');

CREATE TABLE IF NOT EXISTS flags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    step VARCHAR(50),
    flag VARCHAR(100)
);

INSERT INTO flags (step, flag) VALUES
('sqli',   'FLAG{STEP1_SQLi_Auth_Bypass}'),
('upload', 'FLAG{STEP2_FileUpload_Webshell}'),
('rce',    'FLAG{STEP3_RCE_MegaCorp_Pwned}');
