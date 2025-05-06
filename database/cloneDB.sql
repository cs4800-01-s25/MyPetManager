CREATE DATABASE test_repawsitory;

USE repawsitory;

SHOW TABLES;
-- For each table:
CREATE TABLE test_repawsitory.users LIKE repawsitory.users;
CREATE TABLE test_repawsitory.admins LIKE repawsitory.admins;
CREATE TABLE test_repawsitory.petowners LIKE repawsitory.petowners;
CREATE TABLE test_repawsitory.pets LIKE repawsitory.pets;
CREATE TABLE test_repawsitory.appointments LIKE repawsitory.appointments;
CREATE TABLE test_repawsitory.photos LIKE repawsitory.photos;

INSERT INTO test_repawsitory.users SELECT * FROM repawsitory.users;
INSERT INTO test_repawsitory.admins SELECT * FROM repawsitory.admins;
INSERT INTO test_repawsitory.petowners SELECT * FROM repawsitory.petowners; 
INSERT INTO test_repawsitory.pets SELECT * FROM repawsitory.pets;
INSERT INTO test_repawsitory.appointments SELECT * FROM repawsitory.appointments;
INSERT INTO test_repawsitory.photos SELECT * FROM repawsitory.photos;