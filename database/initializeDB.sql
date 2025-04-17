CREATE database repawsitory;
USE repawsitory;

CREATE TABLE users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    UserType ENUM('PetOwner', 'Admin') DEFAULT 'PetOwner',
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    EmailAddress VARCHAR(255) UNIQUE NOT NULL, 
    password VARCHAR(250) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW()
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
