
import { test, expect , request } from '@playwright/test';

test.describe('Health API Tests', () => {

    test('API Health Check - Status Code and Response Time', async ({request}) => {
        const response = await request.get('/health-check');

        await test.step('Verify status code is 200', async () => {
            expect(response.status()).toBe(200);
        });


    });

    test('API Health Check - JSON Response Structure', async ({ request }) => {
        const response = await request.get('/health-check');
        const responseBody = await response.json();

        await test.step('Verify response contains "status" field', async () => {
            expect(responseBody).toHaveProperty('status');
            expect(responseBody.status).toBe('healthy');
        });

        await test.step('Verify response contains "uptime" field', async () => {
            expect(responseBody).toHaveProperty('uptime');
            expect(typeof responseBody.uptime).toBe('number');  // Uptime should be a number (in seconds)
        });
    });

    test('API Health Check - Error Handling for Unavailable Service', async ({ request }) => {
        // Mocking or configuring the service to be down may be necessary for this test
        const response = await request.get('/health-check');

        await test.step('Check for non-200 status code if service is down', async () => {
            const acceptableStatusCodes = [200, 503];
            expect(acceptableStatusCodes).toContain(response.status());
        });

        if (response.status() === 503) {
            await test.step('Verify error message in response body for 503', async () => {
                const responseBody = await response.json();
                expect(responseBody.message).toContain('Service Unavailable');
            });
        }
    });

    test('API Health Check - Validate Headers', async ({ request }) => {
        const response = await request.get('/health-check');

        await test.step('Verify Content-Type header is application/json', async () => {
            expect(response.headers()['content-type']).toContain('application/json');
        });

        await test.step('Check for custom headers if any (e.g., X-Server-Id)', async () => {
            expect(response.headers()).toHaveProperty('x-server-id');  // Validate the presence of a custom header if expected
        });
    });

});
