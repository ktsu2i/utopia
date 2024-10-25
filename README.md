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

- Backend:
  - Golang
  - Echo
  - Air
  - Gorm
  - MySQL
  - Groq for LLM API (model: Llama 3 Groq 70B)

- Infrastructure
  - Docker
  - Docker Compose

# For developers

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

### 2. Build & run the app

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

Run the following command to delete all the containers.
But you will be required to build if you want to run the app again.

```
docker compose down
```

If you want to delete everything including volumes, add `-v` option.

```
docker compose down -v
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
