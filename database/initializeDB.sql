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

CREATE TABLE photos (
    PhotoID INT AUTO_INCREMENT PRIMARY KEY,
    -- PICK BETWEEN USER OR PET
    UserID INT DEFAULT NULL,
    PetID INT DEFAULT NULL,
    S3Key VARCHAR(255) NOT NULL UNIQUE, 
    -- IMPLEMENT FOR IF MULTIPLE PHOTOS CAN BE STORED
    IsPrimary BOOLEAN NOT NULL DEFAULT FALSE,
    -- image/jpeg vs image/png
    ContentType VARCHAR(100),
    UploadedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

-- if pet or user is deleted, automatically delete the photo in db    
FOREIGN KEY (UserID) REFERENCES users (UserID) ON DELETE CASCADE,
FOREIGN KEY (PetID) REFERENCES pets (PetID) ON DELETE CASCADE,

-- Indexes for faster lookups based on linked entities
INDEX idx_photo_user (UserID),
INDEX idx_photo_pet (PetID),
INDEX idx_photo_primary_user (UserID, IsPrimary), 
INDEX idx_photo_primary_pet (PetID, IsPrimary) 
);
