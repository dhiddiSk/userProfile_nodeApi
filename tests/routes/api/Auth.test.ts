import {describe, expect, test} from '@jest/globals';
import {generateHashPassword, updatePasswordInDatabase, registration} from '../../../src/api/routes/api/Auth'


describe('Authentication module tests', () => {
    test('generateHashPassword function', () => {
      // Send arguments to this method and validate if the hash of the
      // passwords are getting saved in the database
    });

    test('updatePasswordInDatabase function', () => {
        // Send the arguments to this method and validate if the password is getting updated in the database
    });

    test('userRegistration function', () => {
        // Check if the user get's registered successfully.
    });
});
