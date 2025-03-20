CREATE database repawsitory;
USE repawsitory;

CREATE TABLE users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    UserType ENUM('PetOwner', 'Admin') NOT NULL,
    FirstName VARCHAR(25),
    LastName VARCHAR(25),
    EmailAddress VARCHAR(50) UNIQUE NOT NULL, 
    Pass VARCHAR(100) NOT NULL 
);
CREATE TABLE admins (
    AdminID INT AUTO_INCREMENT PRIMARY KEY, 
    UserID INT UNIQUE NOT NULL,
    AccessLevel VARCHAR(25), 
    FOREIGN KEY (UserID) REFERENCES users (UserID)
);
CREATE TABLE petowners (
    PetOwnerID VARCHAR(9) PRIMARY KEY,
    UserID INT UNIQUE NOT NULL, 
    DateOfBirth DATE,
    PhoneNumber VARCHAR(12),
    insuranceAccountNumber VARCHAR(20),
    FOREIGN KEY (UserID) REFERENCES users (UserID)
);

-- inserting our fake data
INSERT INTO users (UserType, FirstName, LastName, EmailAddress, Pass)
VALUES
('Admin', 'Brandon', 'Vo', 'gdm842@hotmail.com', 'bv42epic'), 
('Admin', 'My Lien', 'Tan', 'fakeEmail@gmail.com', 'cacheMe'),
('PetOwner','Cheyenne', 'Chavis', 'cheydc@email.com', 'cheydc1234'),
('PetOwner', 'Gian David', 'Marquez', 'giandavidmarquez@gmail.com', 'gian0408');

INSERT INTO admins (UserID, AccessLevel)
VALUES
(1, "ForumModeration"),
(2, "Support"); 

INSERT INTO petowners (PetOwnerID, UserID, DateOfBirth, PhoneNumber, insuranceAccountNumber)
VALUES
('082816157', 3, '2000-5-28', '123-456-7890', 'G8472945'),
('016256789', 4, '2002-8-04', '818-261-2726', 'G4981204');