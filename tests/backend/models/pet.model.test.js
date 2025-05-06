const mockQuery = jest.fn(); // Create the mock function outside

// Mock the database pool module
jest.mock("../../../backend/configs/testDB.config", () => ({
    query: mockQuery, // Use the mock function here
}));

// pet model will be using testDB.config, to work
const petModel = require("../../../backend/models/pet.model");

// Are the queires
describe("Pet Model", () => {
  // Reset mocks before each test
  beforeEach(() => {
    mockQuery.mockClear();
  });

  // --- createPet ---
  describe("createPet", () => {
    // --- Test Data and Expected Results ---
    const validPetData = {
      ownerID: "owner1234",
      name: "Buddy",
      dateOfBirth: "2022-01-01",
      breed: null,
      species: "Dog",
      sex: "Male",
      weight: null,
    };

    const expectedDbResultFromFind = {
      // What findById should return
      PetID: 3,
      PetOwnerID: "owner1234",
      Name: "Buddy",
      DateOfBirth: "2022-01-01",
      Breed: null,
      Species: "Dog",
      Sex: "Male",
      Weight: null,
      // CreatedAt: expect.any(Date) // Optional: if findById selects it
    };

    // --- Test Cases ---

    it("expected behavior: create a pet and return the new pet object", async () => {
      // Mock INSERT success (returns insertId)
      mockQuery.mockResolvedValueOnce([{ insertId: 3 }]);
      // Mock subsequent findById success (returns the pet object)
      mockQuery.mockResolvedValueOnce([[expectedDbResultFromFind]]);

      const result = await petModel.createPet(validPetData);

      // Assertions
      expect(result).toEqual(expectedDbResultFromFind);
      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("INSERT INTO pets"),
        [
          validPetData.ownerID,
          validPetData.name,
          validPetData.dateOfBirth,
          validPetData.breed,
          validPetData.species,
          validPetData.sex,
          validPetData.weight,
        ]
      );
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(
          /SELECT\s+\*\s+FROM\s+pets\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/
        ),
        [3, validPetData.ownerID]
      );
      expect(mockQuery).toHaveBeenCalledTimes(2);
    });

    it("expected behavior: throw an error if required fields are missing (BEFORE DB call)", async () => {
      // Missing name, dateOfBirth, sex
      const incompleteData = { ownerID: "owner1234", species: "Rabbit" };

      // Assertions
      await expect(petModel.createPet(incompleteData)).rejects.toThrow(
        "Missing required fields"
      );
      expect(mockQuery).not.toHaveBeenCalled(); // DB should not be touched
    });

    it("expected behavior: throw an error if insertId is not returned after INSERT", async () => {
      // Mock INSERT success BUT without insertId
      mockQuery.mockResolvedValueOnce([{ affectedRows: 1 /* No insertId */ }]);

      // Assertions
      await expect(petModel.createPet(validPetData)).rejects.toThrow(
        "Failed to create pet: No ID returned."
      );
      // Check that only the INSERT was attempted
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO pets"),
        [
          validPetData.ownerID,
          validPetData.name,
          validPetData.dateOfBirth,
          validPetData.breed,
          validPetData.species,
          validPetData.sex,
          validPetData.weight,
        ]
      );
    });

    it("expected behavior: throw an error if the database INSERT query fails", async () => {
      // Mock INSERT failure
      const dbError = new Error("DB INSERT Error");
      mockQuery.mockRejectedValueOnce(dbError);

      // Assertions
      await expect(petModel.createPet(validPetData)).rejects.toThrow(dbError);

      // Check that only the INSERT was attempted
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO pets"),
        [
          validPetData.ownerID,
          validPetData.name,
          validPetData.dateOfBirth,
          validPetData.breed,
          validPetData.species,
          validPetData.sex,
          validPetData.weight,
        ]
      );
    });

    it("expected behavior: throw an error if the subsequent findById query fails", async () => {
      // Mock INSERT success
      mockQuery.mockResolvedValueOnce([{ insertId: 3 }]);
      // Mock findById failure
      const findError = new Error("DB SELECT Error during findById");
      mockQuery.mockRejectedValueOnce(findError);

      // Assertions
      await expect(petModel.createPet(validPetData)).rejects.toThrow(findError);

      // Check that INSERT was called
      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("INSERT INTO pets"),
        [
          validPetData.ownerID,
          validPetData.name,
          validPetData.dateOfBirth,
          validPetData.breed,
          validPetData.species,
          validPetData.sex,
          validPetData.weight,
        ]
      );
      // Check that findById query was called
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(
          /SELECT\s+\*\s+FROM\s+pets\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/
        ),
        [3, validPetData.ownerID]
      );
      expect(mockQuery).toHaveBeenCalledTimes(2); // Both queries attempted
    });
  }); // --- End of createPet describe ---

  // --- findById Tests ---
  describe("findById", () => {
    const testPetId = 5;
    const testOwnerId = "owner5678";
    // Define what a successful DB result should look like for this pet
    const expectedPetObject = {
      PetID: testPetId,
      PetOwnerID: testOwnerId,
      Name: "Mitsy",
      DateOfBirth: "2021-05-10",
      Breed: "Calico",
      Species: "Cat",
      Sex: "Female",
      Weight: 8.5,
      CreatedAt: expect.any(Date), // Or a fixed string/date if you control it
    };

    it("expected behavior: return the pet object if found for the given PetID and OwnerID", async () => {
      // Mock the pool.query to return the found pet object
      // pool.query resolves with [rows, fields], so mock returns [[petObject]]
      mockQuery.mockResolvedValueOnce([[expectedPetObject]]);

      const result = await petModel.findById(testPetId, testOwnerId);

      // Assertion 1: Check the returned result
      expect(result).toEqual(expectedPetObject);

      // Assertion 2: Check how mockQuery was called
      expect(mockQuery).toHaveBeenCalledTimes(1); // Should be called exactly once
      expect(mockQuery).toHaveBeenCalledWith(
        // Use regex matching for robustness against whitespace
        expect.stringMatching(
          /SELECT\s+\*\s+FROM\s+pets\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/
        ),
        // Check the parameters passed
        [testPetId, testOwnerId]
      );
    });

    it("expected behavior: return null if no pet is found for the given PetID and OwnerID", async () => {
      // Mock the pool.query to return an empty array for rows
      mockQuery.mockResolvedValueOnce([[]]); // Empty rows array

      const result = await petModel.findById(testPetId, testOwnerId);

      // Assertion 1: Check the returned result
      expect(result).toBeNull();

      // Assertion 2: Check how mockQuery was called (it should still be called)
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(
          /SELECT\s+\*\s+FROM\s+pets\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/
        ),
        [testPetId, testOwnerId]
      );
    });

    it("expected behavior: throw an error if the database query fails", async () => {
      // Mock the pool.query to reject with an error
      const dbError = new Error("Database connection lost");
      mockQuery.mockRejectedValueOnce(dbError);

      // Assertion 1: Check that the function throws an error
      // Use await expect(...).rejects syntax for async functions
      await expect(petModel.findById(testPetId, testOwnerId)).rejects.toThrow(
        dbError
      ); // Or .rejects.toThrow("Database connection lost")

      // Assertion 2: Check how mockQuery was called (it should still be called once)
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(
          /SELECT\s+\*\s+FROM\s+pets\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/
        ),
        [testPetId, testOwnerId]
      );
    });
  }); // --- End of findById describe ---

  // --- getAllPetsByOwnerId Tests ---
  describe("getAllPetsByOwnerId", () => {
    const testOwnerId = "owner9999";
    // Define expected pets for this owner
    const expectedPets = [
      {
        PetID: 10,
        PetOwnerID: testOwnerId,
        Name: "Rover",
        Species: "Dog",
        Sex: "Male",
        DateOfBirth: "2020-02-02",
        Breed: "Labrador",
        Weight: 70.1,
      },
      {
        PetID: 11,
        PetOwnerID: testOwnerId,
        Name: "Snowball",
        Species: "Cat",
        Sex: "Female",
        DateOfBirth: "2019-08-15",
        Breed: "Persian",
        Weight: 9.2,
      },
    ];

    it("expected behavior: return an array of pet objects for the given OwnerID", async () => {
      // Mock the pool.query to return the array of pet objects
      mockQuery.mockResolvedValueOnce([expectedPets]); // Note: already an array of objects

      const result = await petModel.getAllPetsByOwnerId(testOwnerId);

      // Assertion 1: Check the returned result
      expect(result).toEqual(expectedPets);
      // Optionally, check array length and properties of individual items
      expect(result).toHaveLength(2);
      expect(result[0].Name).toBe("Rover");

      // Assertion 2: Check how mockQuery was called
      expect(mockQuery).toHaveBeenCalledTimes(1); // Should be called exactly once
      expect(mockQuery).toHaveBeenCalledWith(
        // Use regex matching for robustness against whitespace
        expect.stringMatching(
          /SELECT\s+\*\s+FROM\s+pets\s+WHERE\s+PetOwnerID\s+=\s+\?\s+ORDER BY\s+CreatedAt\s+DESC/i // Added ORDER BY, case-insensitive flag 'i'
        ),
        // Check the parameters passed
        [testOwnerId]
      );
    });

    it("expected behavior: return an empty array if the owner has no pets", async () => {
      // Mock the pool.query to return an empty array for rows
      mockQuery.mockResolvedValueOnce([[]]); // Empty rows array

      const result = await petModel.getAllPetsByOwnerId(testOwnerId);

      // Assertion 1: Check the returned result
      expect(result).toEqual([]); // Expect an empty array
      expect(result).toHaveLength(0);

      // Assertion 2: Check how mockQuery was called (it should still be called)
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(
          /SELECT\s+\*\s+FROM\s+pets\s+WHERE\s+PetOwnerID\s+=\s+\?\s+ORDER BY\s+CreatedAt\s+DESC/i
        ),
        [testOwnerId]
      );
    });

    it("expected behavior: throw an error if the database query fails", async () => {
      // Mock the pool.query to reject with an error
      const dbError = new Error("Database query failed for getAllPets");
      mockQuery.mockRejectedValueOnce(dbError);

      // Assertion 1: Check that the function throws an error
      await expect(petModel.getAllPetsByOwnerId(testOwnerId)).rejects.toThrow(
        dbError
      );

      // Assertion 2: Check how mockQuery was called (it should still be called once)
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(
          /SELECT\s+\*\s+FROM\s+pets\s+WHERE\s+PetOwnerID\s+=\s+\?\s+ORDER BY\s+CreatedAt\s+DESC/i
        ),
        [testOwnerId]
      );
    });
  });

  // --- updatePet Tests ---
  describe("updatePet", () => {
    // --- Test Data ---
    const testPetId = 25;
    const testOwnerId = "owner9564";
    // Represents the pet data *before* the update
    const initialPetData = {
      PetID: testPetId,
      PetOwnerID: testOwnerId,
      Name: "Old Name",
      DateOfBirth: "2020-01-01",
      Breed: "Old Breed",
      Species: "Old Species",
      Sex: "Male",
      Weight: 10.0,
    };

    it("1. expected behavior: update a subset of fields and return the updated pet object", async () => {
      const updateData = {
        Name: "New Name",
        Weight: 12.5,
        Species: "New Species",
        // Non-editable field, should be ignored by the function
        NonEditableField: "should be ignored",
      };
      // Represents the pet data *after* the update
      const expectedUpdatedPet = {
        ...initialPetData, // Start with initial data
        Name: "New Name", // Apply updates
        Weight: 12.5,
        Species: "New Species",
        // CreatedAt might change if DB updates it, or stay the same.
        // If findById re-fetches it, mock its new value if needed.
        // For simplicity, assuming findById returns the updated values.
      };

      // Mock 1: UPDATE query success (affectedRows: 1)
      mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);
      // Mock 2: Subsequent findById success (returns the fully updated pet)
      mockQuery.mockResolvedValueOnce([[expectedUpdatedPet]]); // findById returns array of rows

      const result = await petModel.updatePet(
        testPetId,
        testOwnerId,
        updateData
      );

      // Assertion 1: Check the returned result
      expect(result).toEqual(expectedUpdatedPet); // Should now receive the object

      // Assertion 2: Check the UPDATE call
      expect(mockQuery).toHaveBeenNthCalledWith(
        1, // First call is UPDATE
        expect.stringMatching(
          /UPDATE\s+pets\s+SET\s+Name\s+=\s+\?,\s+Species\s+=\s+\?,\s+Weight\s+=\s+\?\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/
        ),
        [
          updateData.Name,
          updateData.Species,
          updateData.Weight,
          testPetId,
          testOwnerId,
        ]
      );

      // Assertion 3: Check the findById call
      expect(mockQuery).toHaveBeenNthCalledWith(
        2, // Second call is findById's SELECT
        expect.stringMatching(
          /SELECT\s+\*\s+FROM\s+pets\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/
        ),
        [testPetId, testOwnerId] // findById uses PetID and OwnerID
      );

      // Assertion 4: Total calls
      expect(mockQuery).toHaveBeenCalledTimes(2);
    });
    it("2. expected behavior: update all editable fields and return the updated pet object", async () => {
      const updateDataAll = {
        Name: "Completely New Name",
        DateOfBirth: "2022-02-02",
        Breed: "New Breed",
        Species: "New Species",
        Sex: "Female",
        Weight: 15.0,
      };
      const expectedUpdatedPetAll = {
        ...initialPetData,
        ...updateDataAll, // Apply all updates
      };

      // Mock 1: UPDATE success
      mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);
      // Mock 2: findById success
      mockQuery.mockResolvedValueOnce([[expectedUpdatedPetAll]]);

      const result = await petModel.updatePet(
        testPetId,
        testOwnerId,
        updateDataAll
      );

      // Assertion 1: Check result
      expect(result).toEqual(expectedUpdatedPetAll);

      // Assertion 2: Check UPDATE call (ensure all columns are in SET)
      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(
          // Check for all columns in SET clause
          /UPDATE\s+pets\s+SET\s+Name\s+=\s+\?,\s+DateOfBirth\s+=\s+\?,\s+Breed\s+=\s+\?,\s+Species\s+=\s+\?,\s+Sex\s+=\s+\?,\s+Weight\s+=\s+\?\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/i
        ),
        // Check all values in correct order (PascalCase)
        [
          updateDataAll.Name,
          updateDataAll.DateOfBirth,
          updateDataAll.Breed,
          updateDataAll.Species,
          updateDataAll.Sex,
          updateDataAll.Weight,
          testPetId,
          testOwnerId,
        ]
      );

      // Assertion 3: Check findById call
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(
          /SELECT\s+\*\s+FROM\s+pets\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/
        ),
        [testPetId, testOwnerId]
      );

      // Assertion 4: Total calls
      expect(mockQuery).toHaveBeenCalledTimes(2);
    });

    it("3. expected behavior: return current pet data without UPDATE if no valid fields are provided", async () => {
      const updateDataInvalid = {
        // Only non-editable fields or empty object
        NonEditable: "value",
        AnotherInvalid: 123,
      };

      mockQuery.mockResolvedValueOnce([[initialPetData]]); // Return the original data

      const result = await petModel.updatePet(
        testPetId,
        testOwnerId,
        updateDataInvalid
      );

      // Assertion 1: Result should be the initial data (fetched by findById)
      expect(result).toEqual(initialPetData);

      // Assertion 2: Check that ONLY findById's SELECT was called
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(
          /SELECT\s+\*\s+FROM\s+pets\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/
        ),
        [testPetId, testOwnerId]
      );
    });

    it("4. expected behavior: return null if the pet is not found or not owned (UPDATE affects 0 rows)", async () => {
      const updateData = { Name: "Attempted New Name" };

      // Mock 1: UPDATE query affects 0 rows
      mockQuery.mockResolvedValueOnce([{ affectedRows: 0 }]);
      // findById should NOT be called in this case

      const result = await petModel.updatePet(
        testPetId,
        testOwnerId,
        updateData
      );

      // Assertion 1: Check the returned result is null
      expect(result).toBeNull();

      // Assertion 2: Check the UPDATE call was made
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(
          /UPDATE\s+pets\s+SET\s+Name\s+=\s+\?\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/i
        ),
        [updateData.Name, testPetId, testOwnerId]
      );
      // Crucially, findById was NOT called after affectedRows was 0
    });

    it("5. expected behavior: throw an error if the database UPDATE query fails", async () => {
      const updateData = { Name: "Trying Update" };
      const dbUpdateError = new Error("DB UPDATE Failed");

      // Mock 1: UPDATE query rejects
      mockQuery.mockRejectedValueOnce(dbUpdateError);
      // findById should not be reached

      // Assertion 1: Check for thrown error
      await expect(
        petModel.updatePet(testPetId, testOwnerId, updateData)
      ).rejects.toThrow(dbUpdateError);

      // Assertion 2: Check the UPDATE call was attempted
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(
          /UPDATE\s+pets\s+SET\s+Name\s+=\s+\?\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/i
        ),
        // ***** FIX: Use PascalCase key *****
        [updateData.Name, testPetId, testOwnerId]
      );
    });

    it("6. expected behavior: throw an error if UPDATE succeeds but subsequent findById fails", async () => {
      const updateData = { Name: "Good Update Name" };
      const dbFindError = new Error("DB SELECT Failed After Update");

      // Mock 1: UPDATE success
      mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);
      // Mock 2: findById fails
      mockQuery.mockRejectedValueOnce(dbFindError);

      // Assertion 1: Check for thrown error (from findById)
      await expect(
        petModel.updatePet(testPetId, testOwnerId, updateData)
      ).rejects.toThrow(dbFindError);

      // Assertion 2: Check UPDATE call
      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(
          /UPDATE\s+pets\s+SET\s+Name\s+=\s+\?\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/i
        ),
        [updateData.Name, testPetId, testOwnerId]
      );

      // Assertion 3: Check findById call attempt
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(
          /SELECT\s+\*\s+FROM\s+pets\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/
        ),
        [testPetId, testOwnerId]
      );

      // Assertion 4: Total calls
      expect(mockQuery).toHaveBeenCalledTimes(2);
    });
  }); // --- End of updatePet describe ---

  // --- deletePet Tests (NEW BLOCK) ---
  describe("deletePet", () => {
    const testPetId = 42;
    const testOwnerId = "ownerDeleteTest";

    it("1. expected behavior: return true if deletion is successful (affectedRows > 0)", async () => {
      // Mock the DELETE query result for success
      mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await petModel.deletePet(testPetId, testOwnerId);

      // Assertion 1: Check the returned boolean
      expect(result).toBe(true);

      // Assertion 2: Check how mockQuery was called
      expect(mockQuery).toHaveBeenCalledTimes(1); // Should be called exactly once
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(
          /DELETE\s+FROM\s+pets\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/i
        ),
        // Check the parameters passed
        [testPetId, testOwnerId]
      );
    });

    it("2. expected behavior: return false if pet not found or not owned (affectedRows = 0)", async () => {
      // Mock the DELETE query result for no rows affected
      mockQuery.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const result = await petModel.deletePet(testPetId, testOwnerId);

      // Assertion 1: Check the returned boolean
      expect(result).toBe(false);

      // Assertion 2: Check how mockQuery was called (it was still called)
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(
          /DELETE\s+FROM\s+pets\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/i
        ),
        [testPetId, testOwnerId]
      );
    });

    it("3. expected behavior: throw an error if the database DELETE query fails", async () => {
      // Mock the DELETE query to reject with an error
      const dbError = new Error("DB DELETE Failed");
      mockQuery.mockRejectedValueOnce(dbError);

      // Assertion 1: Check that the function throws an error
      await expect(petModel.deletePet(testPetId, testOwnerId)).rejects.toThrow(
        dbError
      );

      // Assertion 2: Check how mockQuery was called (it was still attempted)
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(
          /DELETE\s+FROM\s+pets\s+WHERE\s+PetID\s+=\s+\?\s+AND\s+PetOwnerID\s+=\s+\?/i
        ),
        [testPetId, testOwnerId]
      );
    });
  }); // --- End of deletePet describe ---

});