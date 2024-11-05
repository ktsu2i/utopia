package models

import (
	"sync"

	"github.com/gorilla/websocket"
)

type WebSocketServer struct {
	clients map[*websocket.Conn]bool
	mu      sync.Mutex
}
