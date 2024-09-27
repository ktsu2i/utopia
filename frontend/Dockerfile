FROM node:22.8.0-alpine3.20

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

# Probably don't need this
RUN apt-get update && apt-get install -y \
    curl \
    iputils-ping \
    vim \
    && rm -rf /var/lib/apt/lists/*

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]