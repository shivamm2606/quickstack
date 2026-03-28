# QuickStack ⚡

> Build full-stack MERN apps in seconds - not hours.

[![npm version](https://img.shields.io/npm/v/create-quickstack.svg?color=cb3837&logo=npm)](https://www.npmjs.com/package/create-quickstack)
[![node](https://img.shields.io/node/v/create-quickstack.svg?color=339933&logo=node.js)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/create-quickstack.svg?color=blue)](./LICENSE)

I got tired of spending the first hour of every new project setting up the same Express server, connecting Mongoose, setting up Vite, and configuring CORS. So I built QuickStack.

One command and you get a fully working MERN app with client and server running, zero config needed.

```bash
npx create-quickstack my-app
```

<!-- > **Note:** Uses native NPM Workspaces under the hood. All dependencies are installed in a single `node_modules`, making setup faster and more efficient. -->
---

## What you get

| Layer           | Technology                                        |
| --------------- | ------------------------------------------------- |
| Frontend        | React 18 · Vite · Tailwind CSS · React Router v6  |
| Backend         | Express.js · Mongoose · dotenv · CORS             |
| Auth (optional) | JWT · bcryptjs · cookie-parser · protected routes |
| Tooling         | NPM Workspaces · Axios · concurrently             |


---

## Getting started

**Step 1 — Create the project**

```bash
npx create-quickstack my-app
cd my-app
```

**Step 2 — Configure environment**

```bash
cp .env.example .env
```

Open `.env` and add your `MONGO_URI`. If you chose auth, also add a `JWT_SECRET`.

**Step 3 — run it**

```bash
npm run dev
```

| URL                              | What's there          |
| -------------------------------- | --------------------- |
| `http://localhost:5173`          | React frontend (Vite) |
| `http://localhost:5000`          | Express API           |
| `http://localhost:5000/api/test` | Health check          |

---

## 📦 Installing Packages (Important)

QuickStack uses **NPM Workspaces** to keep your project setup fast and clean. This means there is only **one** `node_modules` folder at the root of your project. 

**You don't need to `cd` into the `client` or `server` folders!** Whenever you need to install a new package, run it from the root folder explicitly passing the workspace flag:

**For the React Frontend:**
```bash
npm install framer-motion --workspace=client

# or 
npm i framer-motion -w client
```

**For the Express Backend:**
```bash
npm install stripe --workspace=server

# or 
npm i stripe -w server
```

> **Note:** Always remember to use the `--workspace` or `-w` flag so your packages deploy correctly when you push to production.

---

## Authentication

By default, the CLI will prompt you to include authentication while creating the project.

If you already know you want it, you can skip the prompt using the flag:

```bash
npx create-quickstack my-app --auth
```

**Endpoints you get:**

| Method | Route                | Description                      |
| ------ | -------------------- | -------------------------------- |
| `POST` | `/api/auth/register` | Create account                   |
| `POST` | `/api/auth/login`    | Login, sets JWT cookie           |
| `POST` | `/api/auth/logout`   | Clears the session cookie        |
| `GET`  | `/api/auth/me`       | Returns current user (protected) |

---

## CLI usage

```
create-quickstack <project-name> [options]

Options:
  --auth         Include authentication
  -v, --version  Show version
  -h, --help     Show help
```

```bash
npx create-quickstack my-app
npx create-quickstack my-app --auth
npx create-quickstack shop-app-2   # hyphens, underscores, numbers all work
```

---

## Scripts

From the project root:

| Script           | What it does                      |
| ---------------- | --------------------------------- |
| `npm run dev`    | Starts client and server together |
| `npm run client` | Frontend only                     |
| `npm run server` | Backend only                      |

---

## Project structure

```
my-app/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   ├── vite.config.js
│   └── package.json
├── server/                  # Express backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── routes/
│   └── index.js
├── .env
├── .env.example
├── .gitignore
└── package.json
```

<details>
<summary>With <code>--auth</code> — extra files added</summary>

```
server/
  models/user.model.js           # User schema
  controllers/user.controller.js # register, login, logout, getUser
  routes/user.routes.js          # mounted at /api/auth
  middleware/authMiddleware.js   # JWT verification, supports header + cookie

client/src/
  pages/Login.jsx
  pages/Signup.jsx
  components/ProtectedRoute.jsx  # Redirects to /login if not authenticated
  services/auth.js               # Thin wrapper around the auth API
  App.jsx                        # Routes with auth
```

</details>
---


## Requirements

- Node.js ≥ 16
- npm ≥ 7
- Git (optional — only used for `git init` on the new project)

---

## Contributing

Clone the repo, link it locally, and use it like a normal user would:

```bash
git clone https://github.com/shivamm2606/quickstack.git
cd quickstack
npm install
npm link
create-quickstack test-app
```

For larger changes, open an issue first to discuss the approach.

---

## License

MIT © [Shivam Gupta](https://github.com/shivamm2606)
>>>>>>> Stashed changes
