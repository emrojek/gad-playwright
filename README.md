# GAD's Test Automation Project with Playwright

## 📌 About the project

Project has been created for educational purposes to improve skills of automation testing using [Playwright 🎭](https://playwright.dev/) framework. Tests have been written for [GAD 🦎](https://github.com/jaktestowac/gad-gui-api-demo) application made available by [jaktestowac.pl](https://jaktestowac.pl/) team and include both **E2E (UI)** and **API** scenarios.

## 🛠️ Tech stack

| Technology | Version |
| ---------- | ------- |
| Playwright | 1.54.1  |
| TypeScript | 5.9.2   |
| Node.js    | 20.19.5 |
| Faker.js   | 9.9.0   |

## 🏗️ Architecture Highlights

- **Functional Page Objects** – Pure functions instead of classes for better composability
- **API Testing Support** – Dedicated project configuration for fast, headless API tests
- **Custom Fixtures** – Reusable test setup with automatic cleanup (`validUser`, `pages`)
- **Test Data Helpers** – Faker.js integration for deterministic random data generation
- **Auth State Management** – StorageState caching for tests requiring authenticated user sessions

## 📂 Project Structure

```
gad-playwright/
├── .auth/
├── fixtures/
│ ├── pages.fixture.ts
│ ├── user.fixture.ts
│ └── api.fixture.ts
├── helpers/
│ ├── api-helpers.ts
│ ├── auth-helpers.ts
│ ├── date-helpers.ts
│ ├── generate-random-data.ts
│ └── test-constants.ts
├── pages/
│ ├── login.page.ts
│ ├── register.page.ts
│ └── user-profile.page.ts
├── tests/
│ ├── api/
│ │   ├── articles.spec.ts
│ │   ├── auth.setup.ts
│ │   ├── users.spec.ts
│ └── e2e/
│     ├── auth.setup.ts
│     ├── login.spec.ts
│     ├── register.spec.ts
│     └── user-profile.spec.ts
├── .gitignore
├── .prettierrc.json
├── package-lock.json
├── package.json
├── playwright.config.ts
├── README.md
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- Git installed

### Installation

```bash
# Clone and navigate the repository
git clone https://github.com/emrojek/gad-playwright.git
cd gad-playwright

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Clone the repository of GAD application
git clone https://github.com/jaktestowac/gad-gui-api-demo.git
```

### Running GAD application

#### Option 1: Manual Start (Recommended)

Start the GAD application in a separate terminal:

```bash
cd path_to/gad-gui-api-demo
npm i
npm run start
```

#### Option 2: Playwright webServer (Optional)

Uncomment the `webServer` section in `playwright.config.ts` and adjust the path to your GAD application:

```typescript
webServer: {
	command: 'cd ../gad-gui-api-demo && npm run start',
	url: 'http://localhost:3000',
	reuseExistingServer: !process.env.CI,
},
```

This will automatically start the application with tests and stop it after execution is finished.

#### Option 3: Docker

Run GAD application using Docker without any local Node.js setup.

**Prerequisites:**

- [Docker](https://docs.docker.com/get-started/get-docker/) installed

```bash
docker run -p 3000:3000 -d jaktestowac/gad
```

Application will be available at `http://localhost:3000`

To stop the container:

```
docker stop $(docker ps -q --filter ancestor=jaktestowac/gad)
```

> **Note:** Images are maintained by jaktestowac.pl team and available at [Docker Hub](https://hub.docker.com/r/jaktestowac/gad)

### Running Tests

```bash
# Run all tests (headless)
npm test

# Run only E2E tests (UI)
npm run test:e2e

# Run only API tests
npm run test:api

# Generate HTML report
npm run report

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with trace
npm run test:trace
```
