import { test, expect } from '../../fixtures/api.fixture';
import { generateRandomArticleData } from '../../helpers/generate-random-data';
import {
	expectSuccessfulJsonResponse,
	expectUnsuccessfulJsonResponse,
	expectJsonResponseWithBody,
	deleteArticle,
} from '../../helpers/api-helpers';

test.describe('Articles API', () => {
	test.describe('Positive scenarios', () => {
		test('GET /api/articles should return list of articles', async ({ authRequest }) => {
			const { title, body, date, image } = generateRandomArticleData();
			const createResponse = await authRequest.post('/api/articles', {
				data: {
					title,
					body,
					date,
					image,
				},
			});
			await expectSuccessfulJsonResponse(createResponse, 201);
			const createdArticle = await createResponse.json();

			try {
				const response = await authRequest.get('/api/articles');
				await expectSuccessfulJsonResponse(response);
				const articles = await response.json();

				expect(articles).toBeInstanceOf(Array);
				expect(articles.length).toBeGreaterThan(0);

				const foundArticle = articles.find((article: any) => article.id === createdArticle.id);
				expect(foundArticle).toBeDefined();
				expect(foundArticle).toEqual({
					id: createdArticle.id,
					title,
					body,
					date,
					image,
					user_id: expect.any(Number),
				});
				expect(foundArticle.id).toBeGreaterThan(0);
			} finally {
				await deleteArticle(authRequest, createdArticle.id);
			}
		});

		test('POST /api/articles should create a new article', async ({ authRequest }) => {
			const { title, body, date, image } = generateRandomArticleData();
			const response = await authRequest.post('/api/articles', {
				data: {
					title,
					body,
					date,
					image,
				},
			});
			await expectSuccessfulJsonResponse(response, 201);
			const article = await response.json();

			try {
				expect(article).toEqual({
					title,
					body,
					date,
					image,
					id: article.id,
					user_id: expect.any(Number),
				});
			} finally {
				await deleteArticle(authRequest, article.id);
			}
		});

		test('GET /api/articles/:id should return a single article', async ({ authRequest }) => {
			const { title, body, date, image } = generateRandomArticleData();
			const createResponse = await authRequest.post('/api/articles', {
				data: {
					title,
					body,
					date,
					image,
				},
			});
			await expectSuccessfulJsonResponse(createResponse, 201);
			const createdArticle = await createResponse.json();

			try {
				const response = await authRequest.get(`/api/articles/${createdArticle.id}`);
				await expectSuccessfulJsonResponse(response);

				const article = await response.json();
				expect(article).toEqual(createdArticle);
			} finally {
				await deleteArticle(authRequest, createdArticle.id);
			}
		});

		test('PUT /api/articles/:id should update a specific article with all fields required', async ({
			authRequest,
		}) => {
			const { title, body, date, image } = generateRandomArticleData();
			const createResponse = await authRequest.post('/api/articles', {
				data: {
					title,
					body,
					date,
					image,
				},
			});
			await expectSuccessfulJsonResponse(createResponse, 201);
			const createdArticle = await createResponse.json();

			try {
				const { title: newTitle, body: newBody, date: newDate, image: newImage } = generateRandomArticleData();
				const updatedResponse = await authRequest.put(`/api/articles/${createdArticle.id}`, {
					data: {
						title: newTitle,
						body: newBody,
						date: newDate,
						image: newImage,
					},
				});

				const updatedArticle = await expectJsonResponseWithBody(updatedResponse);
				expect(updatedArticle).toEqual({
					title: newTitle,
					body: newBody,
					date: newDate,
					image: newImage,
					id: createdArticle.id,
					user_id: createdArticle.user_id,
				});
			} finally {
				await deleteArticle(authRequest, createdArticle.id);
			}
		});

		test('PATCH /api/articles/:id should partially update a specific article', async ({ authRequest }) => {
			const { title, body, date, image } = generateRandomArticleData();
			const createResponse = await authRequest.post('/api/articles', {
				data: {
					title,
					body,
					date,
					image,
				},
			});
			await expectSuccessfulJsonResponse(createResponse, 201);
			const createdArticle = await createResponse.json();

			try {
				const updateTitle = generateRandomArticleData();
				const updatedResponse = await authRequest.patch(`/api/articles/${createdArticle.id}`, {
					data: {
						title: updateTitle.title,
					},
				});

				const updatedArticle = await expectJsonResponseWithBody(updatedResponse);
				expect(updatedArticle).toEqual({
					title: updateTitle.title,
					body: createdArticle.body,
					date: createdArticle.date,
					image: createdArticle.image,
					id: createdArticle.id,
					user_id: createdArticle.user_id,
				});
			} finally {
				await deleteArticle(authRequest, createdArticle.id);
			}
		});

		test('DELETE /api/articles/:id should delete a specific article', async ({ authRequest }) => {
			const { title, body, date, image } = generateRandomArticleData();
			const createResponse = await authRequest.post('/api/articles', {
				data: {
					title,
					body,
					date,
					image,
				},
			});
			await expectSuccessfulJsonResponse(createResponse, 201);
			const createdArticle = await createResponse.json();

			let deleted = false;

			try {
				const response = await authRequest.delete(`/api/articles/${createdArticle.id}`);
				await expectSuccessfulJsonResponse(response);

				const getResponse = await authRequest.get(`/api/articles/${createdArticle.id}`);
				expect(getResponse.status()).toBe(404);

				deleted = true;
			} finally {
				if (!deleted) await deleteArticle(authRequest, createdArticle.id);
			}
		});

		test('HEAD /api/articles/:id should return headers without body', async ({ authRequest }) => {
			const { title, body, date, image } = generateRandomArticleData();
			const createResponse = await authRequest.post('/api/articles', {
				data: {
					title,
					body,
					date,
					image,
				},
			});
			await expectSuccessfulJsonResponse(createResponse, 201);
			const createdArticle = await createResponse.json();

			try {
				const response = await authRequest.head(`/api/articles/${createdArticle.id}`);
				await expectSuccessfulJsonResponse(response);

				const requestBody = await response.text();
				expect(requestBody).toBe('');
			} finally {
				await deleteArticle(authRequest, createdArticle.id);
			}
		});
	});

	test.describe('Negative scenarios', () => {
		test('GET /api/articles/:id should return 404 for non-existing article', async ({ request }) => {
			const response = await request.get('/api/articles/999999999');

			await expectUnsuccessfulJsonResponse(response, 404);
		});

		test('POST /api/articles should return 401 without authorization', async ({ request }) => {
			const { title, body, date, image } = generateRandomArticleData();
			const response = await request.post('/api/articles', {
				data: {
					title,
					body,
					date,
					image,
				},
			});

			await expectUnsuccessfulJsonResponse(response, 401);

			const responseBody = await response.json();

			expect(responseBody).toHaveProperty('error');
			expect(responseBody.error.message).toBe('Access token not provided!');
		});

		test('PUT /api/articles/:id should return 401 without authorization', async ({ request }) => {
			const { title, body, date, image } = generateRandomArticleData();
			const response = await request.put('/api/articles/1', {
				data: {
					title,
					body,
					date,
					image,
				},
			});

			await expectUnsuccessfulJsonResponse(response, 401);

			const responseBody = await response.json();

			expect(responseBody).toHaveProperty('error');
			expect(responseBody.error.message).toBe('Access token not provided!');
		});

		test('PATCH /api/articles/:id should return 401 without authorization', async ({ request }) => {
			const { title } = generateRandomArticleData();
			const response = await request.patch('/api/articles/1', {
				data: {
					title,
				},
			});

			await expectUnsuccessfulJsonResponse(response, 401);

			const responseBody = await response.json();

			expect(responseBody).toHaveProperty('error');
			expect(responseBody.error.message).toBe('Access token not provided!');
		});

		test('DELETE /api/articles/:id should return 401 without authorization', async ({ request }) => {
			const response = await request.delete('/api/articles/1');

			await expectUnsuccessfulJsonResponse(response, 401);

			const responseBody = await response.json();

			expect(responseBody).toHaveProperty('error');
			expect(responseBody.error.message).toBe('Access token not provided!');
		});

		test('POST /api/articles should not create a new article without all required fields', async ({
			authRequest,
		}) => {
			const { title, body } = generateRandomArticleData();
			const response = await authRequest.post('/api/articles', {
				data: {
					title,
					body,
				},
			});

			await expectUnsuccessfulJsonResponse(response, 422);

			const responseBody = await response.json();
			const fieldsRequired = ['user_id', 'title', 'body', 'date'];

			expect(responseBody).toHaveProperty('error');
			expect(responseBody.error.message).toBe('One of mandatory field is missing');
			expect(responseBody.error.details).toEqual(expect.arrayContaining(fieldsRequired));
		});

		test('PUT /api/articles/:id should return 401 when updating another user article', async ({
			authRequest,
			tempAuthUser,
		}) => {
			const articleData = generateRandomArticleData();
			const { userAuthRequest } = tempAuthUser;

			const createResponse = await authRequest.post('/api/articles', { data: articleData });
			await expectSuccessfulJsonResponse(createResponse, 201);
			const createdArticle = await createResponse.json();

			try {
				const updateArticleData = generateRandomArticleData();
				const updateResponse = await userAuthRequest.put(`/api/articles/${createdArticle.id}`, {
					data: updateArticleData,
				});

				await expectUnsuccessfulJsonResponse(updateResponse, 401);

				const responseBody = await updateResponse.json();

				expect(responseBody).toHaveProperty('error');
				expect(responseBody.error.message).toBe('You can not edit articles if You are not an owner');
			} finally {
				await deleteArticle(authRequest, createdArticle.id);
			}
		});
	});

	test.describe('Known bugs', { tag: '@bug' }, () => {
		test('BUG: PATCH /api/articles/:id should return 401 when partial updating another user article', async ({
			authRequest,
			tempAuthUser,
		}) => {
			test.fail(); // Bug: Error message should be more descriptive and similar to the one in PUT request.
			// Message from PATCH request suggest that this is an authentication issue rather than authorization.
			// Received: "Access token for given user is invalid!"

			const articleData = generateRandomArticleData();
			const { userAuthRequest } = tempAuthUser;

			const createResponse = await authRequest.post('/api/articles', { data: articleData });
			await expectSuccessfulJsonResponse(createResponse, 201);
			const createdArticle = await createResponse.json();

			try {
				const { title } = generateRandomArticleData();
				const updateResponse = await userAuthRequest.patch(`/api/articles/${createdArticle.id}`, {
					data: { title },
				});

				await expectUnsuccessfulJsonResponse(updateResponse, 401);

				const responseBody = await updateResponse.json();

				expect(responseBody).toHaveProperty('error');
				expect(responseBody.error.message).toBe('You can not edit articles if You are not an owner');
			} finally {
				await deleteArticle(authRequest, createdArticle.id);
			}
		});

		test('BUG: DELETE /api/articles/:id should return 401 when deleting another user article', async ({
			authRequest,
			tempAuthUser,
		}) => {
			test.fail(); // Bug: Error message should be more descriptive and similar to the one in PUT request.
			// Message from DELETE request suggest that this is an authentication issue rather than authorization.
			// Received: "Access token for given user is invalid!"

			const articleData = generateRandomArticleData();
			const { userAuthRequest } = tempAuthUser;

			const createResponse = await authRequest.post('/api/articles', { data: articleData });
			await expectSuccessfulJsonResponse(createResponse, 201);
			const createdArticle = await createResponse.json();

			try {
				const deleteAttemptResponse = await userAuthRequest.delete(`/api/articles/${createdArticle.id}`);

				await expectUnsuccessfulJsonResponse(deleteAttemptResponse, 401);

				const responseBody = await deleteAttemptResponse.json();

				expect(responseBody).toHaveProperty('error');
				expect(responseBody.error.message).toBe('You can not edit articles if You are not an owner');
			} finally {
				await deleteArticle(authRequest, createdArticle.id);
			}
		});
	});
});
