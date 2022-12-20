import {describe, expect, test} from '@jest/globals';
import {generateHashPassword, updatePasswordInDatabase, registration} from '../../../src/api/routes/api/Auth'
import { UserRegistration } from '../../../src/api/models/UserRegisterSchema'

describe('Authentication module tests', () => {
    let newPassword = "saiKrishna";
    let userTestEmail = "test@test.com";
    let responceObject;
    test('generateHashPassword function', () => {
    // Send arguments to this method and validate if the hash of the passwords are getting saved in the database.
    // Send the arguments like (UserRegistration, newPassword, userEmail, res).
    // Pass the arguments to the method and check if the method is storing the hashed passwords.
    generateHashPassword(UserRegistration, newPassword, userTestEmail, responceObject);
    
    });

    test('updatePasswordInDatabase function', () => {
        // Send the arguments to this method and validate if the password is getting updated in the database.
        updatePasswordInDatabase(userTestEmail, UserRegistration, newPassword, responceObject);
    });

    test('userRegistration function', () => {
        // Check if the user get's registered successfully.
        registration(req, res);
    });
});
