CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);

INSERT INTO users (username, password) VALUES ('admin', 'Luffy212');
INSERT INTO users (username, password) VALUES ('arthur', 'arthur123');
INSERT INTO users (username, password) VALUES ('Louis', 'Godard456');

CREATE TABLE IF NOT EXISTS secret (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flag VARCHAR(100)
);

INSERT INTO secret (flag) VALUES ('FLAG{SQL_Injection_fini}');