import { test, expect, request } from '@playwright/test';

test.describe('User API Tests', () => {
    const userData = {
        username: 'Mhmd',
        password: '1234567',
        newPassword: '7654321',
        email: 'Mhmd@gmail.com'
    };
    let authToken: string;

    test('User Registration - Successful', async ({ request }) => {
        const response = await request.post('/users/register', {
            data: {
                username: userData.username,
                email: userData.email,
                password: userData.password

            },
        });

        await test.step('Verify status code is 201', async () => {
            expect(response.status()).toBe(201);
        });

        await test.step('Verify response contains user ID and username', async () => {
            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('id');
            expect(responseBody.username).toBe(userData.username);
        });
    });

    test('User Login - Successful', async ({ request }) => {
        const response = await request.post('/users/login', {
            data: {
                username: userData.username,
                password: userData.password,
            },
        });

        await test.step('Verify login status code is 200', async () => {
            expect(response.status()).toBe(200);
        });

        await test.step('Verify login response contains auth token', async () => {
            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('token');
            authToken = responseBody.token;
        });
    });
    test('User Profile Retrieve - Successful', async ({ request }) => {
        const response = await request.patch('/users/profile', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        await test.step('Verify profile retrieve status code is 200', async () => {
            expect(response.status()).toBe(200);
        });

    });

    test('User Profile Update - Successful', async ({ request }) => {
        const response = await request.patch('/users/profile', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            data: {
                email: 'Saeed@gmail.com'
            },
        });
        await test.step('Verify profile update status code is 200', async () => {
            expect(response.status()).toBe(200);
        });
        await test.step('Verify updated email in response', async () => {
            const responseBody = await response.json();
            expect(responseBody.email).toBe('Saeed@gmail.com');
        });
    });

    test('Change Password - Successful', async ({ request }) => {
        const response = await request.post('/users/change-password', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            data: {
                oldPassword: userData.password,
                newPassword: userData.newPassword,
            },
        });

        await test.step('Verify password change status code is 200', async () => {
            expect(response.status()).toBe(200);
        });

        await test.step('Verify success message in response', async () => {
            const responseBody = await response.json();
            expect(responseBody.message).toContain('Password changed successfully');
        });
    });

    test('Delete user account - Account deleted Successful', async ({ request }) => {
        const response = await request.post('/users/delete-account', {
            data: {
                username: userData.username,
                password: userData.password,
                email: userData.email,
            },
        });

        await test.step('Verify status code is 200 for Delete account', async () => {
            expect(response.status()).toBe(200);
        });

        test('User Login - Failure with Incorrect Password', async ({ request }) => {
            const response = await request.post('/users/login', {
                data: {
                    username: userData.username,
                    password: '012365412',
                },
            });

            await test.step('Verify status code is 401 for incorrect password', async () => {
                expect(response.status()).toBe(401);
            });

            await test.step('Verify error message in response', async () => {
                const responseBody = await response.json();
                expect(responseBody.message).toContain('Invalid credentials');
            });
        });

        test('User Registration - Failure with Existing Username', async ({ request }) => {
            const response = await request.post('/users/register', {
                data: {
                    username: userData.username,
                    password: '012365489',
                    email: 'samir@gmail.com',
                },
            });

            await test.step('Verify status code is 409 for duplicate username', async () => {
                expect(response.status()).toBe(409);
            });

            await test.step('Verify error message in response', async () => {
                const responseBody = await response.json();
                expect(responseBody.message).toContain('Username already exists');
            });
        });
    });

});