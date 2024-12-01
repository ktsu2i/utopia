# Utopia - Positive & Supportive Social Media

This project started from CIS 3296: Software Design at TUJ.

Project Members:
- [Kaito Tsutsui](https://github.com/ktsu2i)
- [Kseniya Chadovich](https://github.com/kseniya-chadovich)
- [Sumana Reddy](https://github.com/sumana0406)

## Purpose

In today's society, many people use social media daily, often leading to negative interactions such as insults directed at users or celebrities. These hostile exchanges can result in depression, mental health issues, or even suicide. To combat this, I created **Utopia**, a social media application designed to foster mutual support and positivity.

## Tech stack

- Frontend:
  - TypeScript
  - React
  - Next.js
  - Tailwind CSS
  - Zustand
  - shadcn/ui

- Backend:
  - Golang
  - Echo
  - Air
  - Gorm
  - Gorilla WebSocket
  - MySQL
  - Groq for LLM API (model: Llama 3 Groq 70B)

- Infrastructure
  - Docker
  - Docker Compose

# For developers

## File structures

### Overview

```
.
├── frontend
├── backend
├── .env.example
├── .gitignore
├── compose.yaml
└── README.md
```

### Frontend

```
└── frontend
     ├── app
     │   ├── (auth)
     │   │   ├── login
     │   │   │   └── page.tsx
     │   │   └── sign-up
     │   │       └── page.tsx
     │   ├── (authenticated)
     │   │   ├── home
     │   │   │   ├── page.tsx
     │   │   │   └── posts
     │   │   │       └── [postId]
     │   │   │           ├── [replyId]
     │   │   │           │   └── page.tsx
     │   │   │           └── page.tsx
     │   │   ├── layout.tsx
     │   │   ├── messages
     │   │   │   ├── [userId]
     │   │   │   │   └── page.tsx
     │   │   │   ├── _components
     │   │   │   └── page.tsx
     │   │   ├── notifications
     │   │   │   ├── _components
     │   │   │   └── page.tsx
     │   │   ├── profile
     │   │   │   ├── [userId]
     │   │   │   │   └── page.tsx
     │   │   │   ├── edit
     │   │   │   │   └── page.tsx
     │   │   │   └── page.tsx
     │   │   ├── search
     │   │   │   ├── _components
     │   │   │   └── page.tsx
     │   │   └── settings
     │   │       └── page.tsx
     │   ├── fonts
     │   ├── globals.css
     │   ├── layout.tsx
     │   ├── loading.tsx
     │   └── page.tsx
     ├── components
     │   ├── MobileHeader.tsx
     │   ├── MobileNavbar.tsx
     │   ├── MobilePostButton.tsx
     │   ├── PostItem.tsx
     │   ├── ReplyItem.tsx
     │   ├── lp
     │   ├── right-sidebar
     │   ├── sidebar
     │   └── ui                     // shadcn/ui
     ├── components.json
     ├── hooks
     │   ├── useAuth.ts
     │   └── useEmojis.ts
     ├── lib
     │   ├── types.ts
     │   ├── utils.ts
     │   └── validations.ts
     ├── public
     │   └── images
     ├── stores                     // zustand
     │   ├── authStore.ts
     │   └── notificationStore.ts
     └── Dockerfile
```

### Backend

```
└── backend
     ├── db
     │   └── db.go
     ├── handlers              // All the handler functions 
     │   ├── auth.go
     │   ├── emoji.go
     │   ├── follower.go
     │   ├── groq.go
     │   ├── message.go
     │   ├── notification.go
     │   ├── post.go
     │   ├── reaction.go
     │   ├── reply.go
     │   ├── user.go
     │   └── websocket.go
     ├── migrations             // All SQL migration files
     ├── models                 // All the defined structures
     │   ├── auth.go
     │   ├── emoji.go
     │   ├── follower.go
     │   ├── groq.go
     │   ├── message.go
     │   ├── notification.go
     │   ├── post.go
     │   ├── reaction.go
     │   ├── reply.go
     │   └── user.go
     ├── .air.toml
     ├── .gitignore
     ├── dbconfig.yml
     ├── Dockerfile
     ├── go.mod
     ├── go.sum
     ├── main.go
     └── route.go
```

## Prerequisites

To run this program, you need to have Docker and Docker Compose installed on your machine.

- Docker
- Docker Compose

If you already have them on your machine, you can skip the section below.

### For Mac

Go to https://docs.docker.com/desktop/install/mac-install/ and install **Docker Desktop**.

### For Windows

Go to https://docs.docker.com/desktop/install/windows-install/ and install **Docker Desktop**.

If you face an error saying "WSL 2 installation is incomplete", then you have to install the kernel update and restart your machine. 

### For Linux

If you are on Ubuntu, go to https://docs.docker.com/desktop/install/linux/ubuntu/ and install **Docker Desktop**.

There are some instructions for other Linux distributions, so please follow the instructions on the website to install **Docker** and **Docker Compose**.

### Check if you successfully installed

Run the following command to check the versions of Docker and Docker Compose.

```
docker --version
docker compose version
```

## How to run

### 1. Clone this repository

```
git clone https://github.com/ktsu2i/utopia.git
```

### 2. Setup

Copy `.env.example` and add secret keys.

```
cp .env.example .env
```

**If you are NOT using Apple Silicon, comment out this line.**

```yaml:compose.yaml
  db:
    image: mysql:8.0
    # platform: linux/amd64
```

### 3. Build & run the app

Depending on version of Docker Compose, you might want to use `docker-compose` instead of `docker compose`.

```
docker compose up --build
```

Once you build the app, you can run the app without `--build` option unless you don't change `Dockerfile` or `compose.yaml`.

```
docker compose up
```

### Optional: How to go inside the container

You may want to run some commands for MySQL CLI. Run this following command to go inside the MySQL container.

```
docker exec -it utopia_db mysql -u <username> -p
```

After you type the password, you will get to the inside the container and run any commands you want.
However, if you need to run some queries for `utopia_dev` database, run this command inside the container.

```
use utopia_dev;
```

Then, you will be able to use `utopia_dev` database and run any queries you want.

<img width="937" alt="mysql query" src="https://github.com/user-attachments/assets/74301e20-d163-4f9f-aa82-1d1df1452061">

### 3. Stop the containers

```
docker compose stop
```

If you want to start over, run these commands. But keep in mind that all the data in database will be reset.

```
docker compose down -v
docker compose build --no-cache
docker compose up
```

## SQL migration

This project is using [sql-migrate](https://github.com/rubenv/sql-migrate), which is a SQL schema migration tool for Golang.

### Create a new migration file

Go to `/backend` directory and run the following command to create a migration file under `/backend/migrations`.

```
cd backend
sql-migrate new [name]
```

When you run `docker compose up`, it automatically migrates the files. Thus, you are just required to add migration files if necessary.
