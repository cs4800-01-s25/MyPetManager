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
