import { test, expect, request } from '@playwright/test';

test.describe('Note API Tests', () => {
    const noteData = {
        title: 'Test Note',
        description : 'This is the description of the test note' ,
        category: 'This is the category of the test note.'
    };
    let noteId: string;
    let authToken: string;

    test.beforeAll(async ({ request }) => {
        const loginResponse = await request.post('/login', {
            data: {
                username: 'Mhmd',
                password: '1234567',
            },
        });
        const responseBody = await loginResponse.json();
        authToken = responseBody.token;
    });

    test('Create a new note - Successful', async ({ request }) => {
        const response = await request.post('/notes', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            data: {
                title: noteData.title,
                description: noteData.description,
                category: noteData.category
            },
        });
        await test.step('Verify status code is 201 for note creation', async () => {
            expect(response.status()).toBe(201);
        });
        await test.step('Verify response contains note ID and title', async () => {
            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('id');
            expect(responseBody.title).toBe(noteData.title);
            noteId = responseBody.id;
        });
    });

    test('Retrieve the created note - Successful', async ({ request }) => {
        const response = await request.get(`/notes/${noteId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        await test.step('Verify status code is 200 for note retrieval', async () => {
            expect(response.status()).toBe(200);
        });

        await test.step('Verify note details match the created note', async () => {
            const responseBody = await response.json();
            expect(responseBody.id).toBe(noteId);
            expect(responseBody.title).toBe(noteData.title);
            expect(responseBody.description).toBe(noteData.description)
            expect(responseBody.category).toBe(noteData.category);
        });
    });

    test('Update the note content - Successful', async ({ request }) => {
        const updatedDescription = 'Updated note Description';

        const response = await request.patch(`/notes/${noteId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            data: {
                content: updatedDescription,
            },
        });

        await test.step('Verify status code is 200 for note update', async () => {
            expect(response.status()).toBe(200);
        });

        await test.step('Verify updated content in response', async () => {
            const responseBody = await response.json();
            expect(responseBody.content).toBe(updatedDescription);
        });
    });

    test('Delete the note - Successful', async ({ request }) => {
        const response = await request.delete(`/notes/${noteId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        await test.step('Verify status code is 204 for note deletion', async () => {
            expect(response.status()).toBe(204);
        });
    });

    test('Retrieve deleted note - Not Found', async ({ request }) => {
        const response = await request.get(`/notes/${noteId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        await test.step('Verify status code is 404 for non-existing note', async () => {
            expect(response.status()).toBe(404);
        });

        await test.step('Verify error message in response', async () => {
            const responseBody = await response.json();
            expect(responseBody.message).toContain('Note not found');
        });
    });
});