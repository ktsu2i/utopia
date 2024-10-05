FROM golang:1.23-bookworm

WORKDIR /code

RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum /code/
RUN go mod download

COPY . /code
COPY .air.toml /code/.air.toml

CMD ["air", "-c", ".air.toml"]
