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

## Features

### LP

This landing page is for those who are new to Utopia. You can see brief explanation about Utopia.

<p>
  <img width="500" alt="lp1" src="https://github.com/user-attachments/assets/5f956fe7-13e4-4cf5-8c6e-1ca499cc70ff">
  <img width="500" alt="lp2" src="https://github.com/user-attachments/assets/1e0848b0-d36c-4a0a-87bb-b5b51e126fb5">
</p>

### Sign up & Login

<p>
  <img width="500" alt="sign-up" src="https://github.com/user-attachments/assets/159bc203-1b36-4365-b839-0169c0f01ae4">
  <img width="500" alt="login" src="https://github.com/user-attachments/assets/972b8e5e-db6e-4a43-8637-408fcbd33df2">
</p>

### Post, Reply, and Reactions

You can post and reply like other social media. You can react to every post and reply.

<p>
  <img width="500" alt="post" src="https://github.com/user-attachments/assets/c918550f-bb81-433b-9fc1-b8d6ce35a7dc">
  <img width="500" alt="reply" src="https://github.com/user-attachments/assets/a342a922-e342-46f7-9481-f3e55b352acc">
</p>

#### Utopia detects inappropriate content and does NOT allow users to post it.

Utopia detects not only f-words but also offensive, sexual, and any inappropriate content.
We ensure to provide the most peaceful place on the Internet.

<p>
  <img width="446" alt="bad-post" src="https://github.com/user-attachments/assets/6df92c9c-64ef-41ef-bbf7-b5c3d8776226">
  <img width="598" alt="bad-reply" src="https://github.com/user-attachments/assets/7e6b765d-216a-453b-9086-47010d004ddb">
</p>

### Search for Posts and Users

You can search posts and users.

<p>
  <img width="500" alt="search-post" src="https://github.com/user-attachments/assets/f50b44cb-2679-4bf1-bd16-4bdd86e0ac08">
  <img width="500" alt="search-user" src="https://github.com/user-attachments/assets/55bf8c0b-dc9c-422d-9dac-1e8caf0a2dd5">
</p>

### Notifications

When users do some actions such as follow, react, reply, or send a message, it sends a notification and displays a notification badge until you check the notifications.

<p>
  <img width="500" alt="notifications" src="https://github.com/user-attachments/assets/7d2d674f-95c7-4b7f-bd9a-45099de9ac59">
  <img width="289" alt="notification-badge" src="https://github.com/user-attachments/assets/5ed1ee9b-fd66-4a7c-87b6-118eeffec646">
</p>

### Direct Messages

You can send messages directly to other users realtime.

<p>
  <img width="500" alt="dm" src="https://github.com/user-attachments/assets/2e0a5d6b-bda6-425f-8cf7-eedf1dc6906f">
  <img width="500" alt="chat" src="https://github.com/user-attachments/assets/a15432af-8417-4993-b36b-4733457b64b0">
</p>

Of course, Utopia detects inappropriate content in DMs. 

<img width="467" alt="bad-dm" src="https://github.com/user-attachments/assets/53b57421-dc74-496a-b64d-9af184cc86a1">

### Profile

You can see your own profile and update your information here.

<p>
  <img width="500" alt="profile" src="https://github.com/user-attachments/assets/99d75d1b-c7b0-45b5-9c6b-67f94b8e9ff1">
  <img width="500" alt="edit-profile" src="https://github.com/user-attachments/assets/14899bf9-19fd-4aab-95b5-9f0339d89b44">
</p>

Also, you can visit other user's profile.

<img width="500" alt="user-profile" src="https://github.com/user-attachments/assets/44cfab8e-cad4-45f6-bed4-32dac30474bb">

Again, you are not allowed to add any inappropriate content in Utopia.

<img width="467" alt="bad-bio" src="https://github.com/user-attachments/assets/c264cfb4-ad7f-4198-8aff-ca8d146d6532">

### Settings

Settings feature is coming soon...

<img width="500" alt="settings" src="https://github.com/user-attachments/assets/f0c134a8-95ca-45bd-bb64-b13833b5866e">

### Responsive Design

Utopia provides you responsive design for multiple devices such as tablets and smartphones.

<p>
  <img width="600" alt="tablet" src="https://github.com/user-attachments/assets/a1cbb172-2b91-4747-80a0-2e20a4eb3049">
  <img width="400" alt="phone" src="https://github.com/user-attachments/assets/60f17246-eccc-436b-98ed-51adf8017f8d">
</p>

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
