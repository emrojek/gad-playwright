import { test, expect } from '../../fixtures/api.fixture';
import { generateRandomArticleData } from '../../helpers/generate-random-data';
import { expectSuccessfulJsonResponse, expectJsonResponseWithBody, deleteArticle } from '../../helpers/api-helpers';

test.describe('Articles API', () => {
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

	test('PUT /api/articles/:id should update a specific article with all fields required', async ({ authRequest }) => {
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
