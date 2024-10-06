FROM golang:1.23-bookworm

WORKDIR /code

RUN go install github.com/air-verse/air@latest
RUN go install github.com/rubenv/sql-migrate/...@latest

COPY go.mod go.sum /code/
RUN go mod download

COPY . /code
COPY .air.toml /code/.air.toml

CMD ["sh", "-c", "sql-migrate up && air -c .air.toml"]
