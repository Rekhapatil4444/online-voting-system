-- Step 1: Create DB only once

CREATE DATABASE IF NOT EXISTS voting_system;
DROP DATABASE IF EXISTS voting_system;

-- Step 2: Use DB
USE voting_system;

-- Step 3: Drop old tables (safe reset)
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS positions;
DROP TABLE IF EXISTS voters;
DROP TABLE IF EXISTS elections;

-- Step 4: Create tables

CREATE TABLE voters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    voter_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    position_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position_id INT NOT NULL,
    party VARCHAR(50),
    votes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE
);

CREATE TABLE votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voter_id INT NOT NULL,
    candidate_id INT NOT NULL,
    position_id INT NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voter_id) REFERENCES voters(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_vote (voter_id, position_id)
);

CREATE TABLE elections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO positions (position_name, description) VALUES
('Chief Minister', 'State Leader of Andhra Pradesh'),
('MLA', 'Member of Legislative Assembly'),
('MP', 'Member of Parliament'); 

INSERT INTO candidates (name, position_id, party) VALUES
-- Chief Minister Candidates
('YS Jagan Mohan Reddy', 1, 'YSRCP'),
('N. Chandrababu Naidu', 1, 'TDP'),
('Pawan Kalyan', 1, 'Janasena'),

-- MLA Candidatess
('Alla Ramakrishna Reddy', 2, 'YSRCP'),
('Nara Lokesh', 2, 'TDP'),
('Nadendla Manohar', 2, 'Janasena'),

-- MP Candidates
('Mithun Reddy', 3, 'YSRCP'),
('Kesineni Srinivas', 3, 'TDP'),
('Raghurama Krishnam Raju', 3, 'Independent');

INSERT INTO voters (name, age, voter_id, email, password) VALUES
('Rekha Patil', 21, 'AP001', 'rekha@gmail.com', '1234'),
('Ravi Kumar', 30, 'AP002', 'ravi@gmail.com', '1234'),
('Sita Devi', 28, 'AP003', 'sita@gmail.com', '1234'),
('Arjun Reddy', 35, 'AP004', 'arjun@gmail.com', '1234'),
('Lakshmi Priya', 26, 'AP005', 'lakshmi@gmail.com', '1234'),
('Kiran Kumar', 40, 'AP006', 'kiran@gmail.com', '1234'),
('Anjali Reddy', 22, 'AP007', 'anjali@gmail.com', '1234'),
('Venkatesh', 33, 'AP008', 'venkat@gmail.com', '1234'),
('Sunitha', 29, 'AP009', 'sunitha@gmail.com', '1234'),
('Prasad', 45, 'AP010', 'prasad@gmail.com', '1234'),
('Harika', 24, 'AP011', 'harika@gmail.com', '1234'),
('Mahesh', 31, 'AP012', 'mahesh@gmail.com', '1234'); 

INSERT INTO elections (title, description, start_date, end_date) VALUES
('AP General Elections 2026', 'State Assembly Elections', '2026-04-01', '2026-04-30'),
('Local Body Elections', 'Village & Municipality Elections', '2026-05-01', '2026-05-31');

INSERT INTO votes (voter_id, candidate_id, position_id) VALUES
(1, 1, 2),
(2, 2, 1),
(3, 1, 1),
(4, 3, 1),

(5, 4, 2),
(6, 5, 2),
(7, 6, 2),

(8, 7, 3),
(9, 8, 3),
(10, 7, 3);
SELECT * FROM positions;