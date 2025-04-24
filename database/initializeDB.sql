CREATE DATABASE IF NOT EXISTS repawsitory;

USE repawsitory;

CREATE TABLE users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    UserType ENUM('PetOwner', 'Admin') DEFAULT 'PetOwner',
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    EmailAddress VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE admins (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT UNIQUE NOT NULL,
    AccessLevel VARCHAR(25),
    FOREIGN KEY (UserID) REFERENCES users (UserID) ON DELETE CASCADE
);

CREATE TABLE petowners (
    PetOwnerID VARCHAR(9) PRIMARY KEY,
    UserID INT UNIQUE NOT NULL,
    DateOfBirth DATE,
    PhoneNumber VARCHAR(15),
    insuranceAccountNumber VARCHAR(20),
    FOREIGN KEY (UserID) REFERENCES users (UserID) ON DELETE CASCADE
);

CREATE TABLE pets (
    PetID INT AUTO_INCREMENT PRIMARY KEY,
    PetOwnerID VARCHAR(9) NOT NULL,
    Name VARCHAR(100) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Breed VARCHAR(100),
    Species VARCHAR(50),
    Sex ENUM('Female', 'Male', 'Other') NOT NULL,
    Weight DECIMAL(5, 2),
    PetPhotoURL VARCHAR(2048) DEFAULT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (PetOwnerID) REFERENCES petowners (PetOwnerID) ON DELETE CASCADE
);


CREATE TABLE appointments (
    AppointmentID INT AUTO_INCREMENT PRIMARY KEY,
    PetID INT NOT NULL,
    PetOwnerID VARCHAR(9) NOT NULL,
    AppointmentDateTime DATETIME NOT NULL,
    Status ENUM('Scheduled', 'Completed', 'Cancelled', 'NoShow') NOT NULL DEFAULT 'Scheduled',
    Reason VARCHAR(255) NULL,
    Location VARCHAR(100),
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),

FOREIGN KEY (PetID) REFERENCES pets (PetID) ON DELETE RESTRICT, 
FOREIGN KEY (PetOwnerID) REFERENCES petowners (PetOwnerID) ON DELETE RESTRICT,

-- Indexes for common query lookups, to make things faster
INDEX idx_app_pet (PetID),
INDEX idx_app_owner (PetOwnerID),
INDEX idx_app_datetime (AppointmentDateTime),
INDEX idx_app_status (Status)
);