# GAD's Test Automation Project with Playwright

## 📌 About the project

Project has been created for educational purposes to improve skills of automation e2e testing using [Playwright 🎭](https://playwright.dev/) framework. Tests have been written for [GAD 🦎](https://github.com/jaktestowac/gad-gui-api-demo) application made available by [jaktestowac.pl](https://jaktestowac.pl/) team.

## 🛠️ Tech stack

| Technology | Version |
| ---------- | ------- |
| Playwright | 1.54.1  |
| TypeScript | 5.9.2   |
| Node.js    | 20.19.5 |
| Faker.js   | 9.9.0   |

## 🏗️ Architecture Highlights

-   **Functional Page Objects** – Pure functions instead of classes for better composability
-   **Custom Fixtures** – Reusable test setup with automatic cleanup (`validUser`, `pages`)
-   **Test Data Helpers** – Faker.js integration for deterministic random data generation
-   **Auth State Management** – StorageState caching for tests requiring authenticated user sessions

## 📂 Project Structure

```
gad-playwright/
├── .auth/
├── fixtures/
│ ├── pages.fixture.ts
│ └── user.fixture.ts
├── helpers/
│ ├── date-helpers.ts
│ ├── generate-random-data.ts
│ └── test-constants.ts
├── pages/
│ ├── login.page.ts
│ ├── register.page.ts
│ └── user-profile.page.ts
├── tests/
│ ├── auth.setup.ts
│ ├── login.spec.ts
│ ├── register.spec.ts
│ └── user-profile.spec.ts
├── .gitignore
├── .prettierrc.json
├── package.json
├── playwright.config.ts
├── README.md
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

-   Node.js 20.x or higher
-   Git installed

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

#### Option 3: Custom Bash Script (Windows + Git Bash)

Create a `start-gad.sh` script in your GAD application folder:

```bash
#!/bin/bash
echo "GAD starting..."
echo "3 seconds remaining to browser open..."

(sleep 3 && start http://localhost:3000) & npm run start
```

Create a desktop shortcut from `git-bash.exe` file (default file location is `C:\Program Files\Git`) with the following target element:

```
"C:\Program Files\Git\git-bash.exe" --cd=C:\Projects\gad-gui-api-demo -c "./start-gad.sh; exec bash"
```

### Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with trace
npm run test:trace

# Generate HTML report
npm run report
```
