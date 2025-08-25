const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const callback = (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
}

bcrypt.hash('1234', saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
  } else {
    console.log("Hashed password:", hash);

    const SQLSTATEMENT = `

      SET FOREIGN_KEY_CHECKS = 0;

      DROP TABLE IF EXISTS User;

      DROP TABLE IF EXISTS equipment;

      DROP TABLE IF EXISTS FitnessChallenge;

      DROP TABLE IF EXISTS UserCompletion;

      DROP TABLE IF EXISTS ChallengeReviews;

      DROP TABLE IF EXISTS PlayerCompletion;

      DROP TABLE IF EXISTS class;

      DROP TABLE IF EXISTS enemy;

      DROP TABLE IF EXISTS quests;

      DROP TABLE IF EXISTS Player;

      DROP TABLE IF EXISTS user_inventory;

      SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE User (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  skillpoints INT DEFAULT 0,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name TEXT NOT NULL,
  classID INT,
  level_required INT, 
  hp INT,
  atk INT,
  skillpoints INT NOT NULL
);

CREATE TABLE FitnessChallenge (
challenge_id INT AUTO_INCREMENT PRIMARY KEY,
challenge TEXT NOT NULL,
creator_id INT NOT NULL,
skillpoints INT NOT NULL
);

CREATE TABLE UserCompletion (
complete_id INT AUTO_INCREMENT PRIMARY KEY,
challenge_id INT NOT NULL,
user_id INT NOT NULL,
completed VARCHAR(5) NOT NULL,
creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
notes TEXT
);

CREATE TABLE ChallengeReviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (challenge_id) REFERENCES FitnessChallenge(challenge_id)
);

CREATE TABLE PlayerCompletion (
complete_id INT AUTO_INCREMENT PRIMARY KEY,
quests_id INT NOT NULL,
user_id INT NOT NULL,
player_id INT NOT NULL,
creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE class (
  number INT PRIMARY KEY,
  name TEXT NOT NULL,
  basehp INT,
  baseatk INT,
  hp_per_level INT,
  atk_per_level INT
);

CREATE TABLE enemy (
  number INT PRIMARY KEY,
  name TEXT NOT NULL,
  hp INT,
  atk INT
);

CREATE TABLE quests (
quests_id INT AUTO_INCREMENT PRIMARY KEY,
quests TEXT NOT NULL,
level_reward INT NOT NULL,
level_required INT
);

CREATE TABLE Player (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  name TEXT NOT NULL,
  level INT NOT NULL,
  class TEXT NOT NULL,
  hp INT DEFAULT 0,
  atk INT DEFAULT 0,
  armor_id INT DEFAULT NULL, 
  weapon_id INT DEFAULT NULL,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_inventory (
  inventory_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  equipment_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES User(user_id),
  FOREIGN KEY (equipment_id) REFERENCES equipment(id)
);

-- DROP the trigger first if it exists
DROP TRIGGER IF EXISTS auto_update_player_stats;

-- CREATE the trigger
CREATE TRIGGER auto_update_player_stats
BEFORE UPDATE ON Player
FOR EACH ROW
BEGIN
    DECLARE armor_hp2 INT DEFAULT 0;
    DECLARE armor_atk2 INT DEFAULT 0;
    DECLARE weapon_hp2 INT DEFAULT 0;
    DECLARE weapon_atk2 INT DEFAULT 0;
    DECLARE class_basehp INT DEFAULT 0;
    DECLARE class_baseatk INT DEFAULT 0;
    DECLARE hp_per_level2 INT DEFAULT 0;
    DECLARE atk_per_level2 INT DEFAULT 0;
    DECLARE new_hp INT DEFAULT 0;
    DECLARE new_atk INT DEFAULT 0;

    SELECT hp, atk
    INTO armor_hp2, armor_atk2
    FROM equipment
    WHERE id = NEW.armor_id;

    SELECT hp, atk
    INTO weapon_hp2, weapon_atk2
    FROM equipment
    WHERE id = NEW.weapon_id;

    -- Get class base stats and per-level increments from the class table
    SELECT basehp, baseatk, hp_per_level, atk_per_level 
    INTO class_basehp, class_baseatk, hp_per_level2, atk_per_level2
    FROM class
    WHERE name = NEW.class;

    -- If level = 1, set to base stats
    IF NEW.level = 1 THEN
        SET new_hp = class_basehp + armor_hp2 + weapon_hp2;
        SET new_atk = class_baseatk + armor_atk2 + weapon_atk2;
    ELSE
        -- Calculate new HP and ATK based on the new level
        SET new_hp = class_basehp + armor_hp2 + weapon_hp2 + (NEW.level - 1) * hp_per_level2;
        SET new_atk = class_baseatk + armor_atk2 + weapon_atk2 + (NEW.level - 1) * atk_per_level2;
    END IF;

    -- Set the new HP and ATK values for the updated player
    SET NEW.hp = new_hp;
    SET NEW.atk = new_atk;
END;

-- DROP the trigger first if it exists
DROP TRIGGER IF EXISTS auto_insert_player_stats;

-- CREATE the trigger
CREATE TRIGGER auto_insert_player_stats
BEFORE INSERT ON Player
FOR EACH ROW
BEGIN
    DECLARE armor_hp2 INT DEFAULT 0;
    DECLARE armor_atk2 INT DEFAULT 0;
    DECLARE weapon_hp2 INT DEFAULT 0;
    DECLARE weapon_atk2 INT DEFAULT 0;
    DECLARE class_basehp INT DEFAULT 0;
    DECLARE class_baseatk INT DEFAULT 0;
    DECLARE hp_per_level2 INT DEFAULT 0;
    DECLARE atk_per_level2 INT DEFAULT 0;
    DECLARE new_hp INT DEFAULT 0;
    DECLARE new_atk INT DEFAULT 0;

    SELECT hp, atk
    INTO armor_hp2, armor_atk2
    FROM equipment
    WHERE id = NEW.armor_id;

    SELECT hp, atk
    INTO weapon_hp2, weapon_atk2
    FROM equipment
    WHERE id = NEW.weapon_id;

    -- Get class base stats and per-level increments from the class table
    SELECT basehp, baseatk, hp_per_level, atk_per_level 
    INTO class_basehp, class_baseatk, hp_per_level2, atk_per_level2
    FROM class
    WHERE name = NEW.class;

    -- If level = 1, set to base stats
    IF NEW.level = 1 THEN
        SET new_hp = class_basehp + armor_hp2 + weapon_hp2;
        SET new_atk = class_baseatk + armor_atk2 + weapon_atk2;
    ELSE
        -- Calculate new HP and ATK based on the new level
        SET new_hp = class_basehp + armor_hp2 + weapon_hp2 + (NEW.level - 1) * hp_per_level2;
        SET new_atk = class_baseatk + armor_atk2 + weapon_atk2 + (NEW.level - 1) * atk_per_level2;
    END IF;

    SET NEW.hp = new_hp;
    SET NEW.atk = new_atk;
END;

INSERT INTO FitnessChallenge (creator_id, challenge, skillpoints) VALUES
(1, 'Complete 2.4km within 15 minutes', 50),
(1, 'Cycle around the island for at least 50km', 100),
(2, 'Complete a full marathon (42.2km)', 200),
(2, 'Hold a plank for 5 minutes', 50),
(2, 'Perform 100 push-ups in one session', 75);

INSERT INTO equipment (id, name, classID, level_required, hp, atk, skillpoints) VALUES
(1, 'Iron Sword', 1, 1, 20, 10, 100),
(2, 'Iron Armor', 1, 1, 200, 0, 120),
(3, 'Steel Sword', 1, 10, 100, 50, 250),
(4, 'Steel Armor', 1, 10, 600, 0, 300),
(5, 'Magic Wand', 2, 1, 0, 20, 100),
(6, 'Robe of Insight', 2, 1, 70, 10, 120), 
(7, 'Staff of Wisdom', 2, 10, 0, 100, 250),
(8, 'Robe of Power', 2, 10, 300, 50, 300),
(9, 'Longbow', 3, 1, 10, 12, 100), 
(10, 'Leather Armor', 3, 1, 130, 6, 120), 
(11, 'Composite Bow', 3, 10, 30, 70, 250),
(12, 'Hunter Cloak', 3, 10, 450, 20, 300);

INSERT INTO class (number, name, basehp, baseatk, hp_per_level, atk_per_level) VALUES
(1, 'Warrior', 200, 5, 50, 5),
(2, 'Mage', 100, 10, 20, 12),
(3, 'Archer', 120, 7, 35, 8);

INSERT INTO Player (user_id, name, level, class, armor_id, weapon_id) VALUES
(1, 'Jim', 10, 'Warrior', 2, 1),
(1, 'Masha', 30, 'Mage', 6, 5),
(1, 'Bob', 99, 'Archer', 12, 11);

INSERT INTO enemy (number, name, hp, atk) VALUES
(1, 'goblin', 50, 2),
(2, 'slime', 60, 3),
(3, 'skeleton', 100, 2),
(4, 'troll', 200, 5),
(5, 'golem', 500, 20),
(6, 'slime king', 1000, 30),
(7, 'goblin king', 1500, 20),
(8, 'skeleton king', 3000, 50),
(9, 'Ruler of hell', 12000, 300);

INSERT INTO quests (quests, level_reward, level_required) VALUES
('Kill 1 goblin', 1, 1),
('Kill 3 slimes', 1.5, 1),
('Kill 5 skeletons', 2, 3),
('Kill 1 goblin king', 5, 15),
('Kill 3 trolls', 3, 5),
('Kill 1 slime king', 4, 10),
('Kill 1 skeleton king', 5, 20),
('Kill 10 golems', 5, 40),
('Kill 1 Ruler of hell', 10, 100);

INSERT INTO User (username, email, password, skillpoints) VALUES
('admin', 'a@a.com', '${hash}', 1000);
`;

    pool.query(SQLSTATEMENT, callback);
  }
});
