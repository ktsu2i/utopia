package handlers

import (
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

type WebSocketServer struct {
	clients map[*websocket.Conn]bool
	mu      sync.Mutex
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var wsServer = WebSocketServer{
	clients: make(map[*websocket.Conn]bool),
}

func HandleWebSocket(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()

	// Add client
	wsServer.mu.Lock()
	wsServer.clients[ws] = true
	wsServer.mu.Unlock()

	defer func() {
		wsServer.mu.Lock()
		delete(wsServer.clients, ws)
		wsServer.mu.Unlock()
	}()

	for {
		_, _, err := ws.ReadMessage()
		if err != nil {
			break
		}
	}
	return nil
}

func NotifyClients(message string) {
	wsServer.mu.Lock()
	defer wsServer.mu.Unlock()
	for client := range wsServer.clients {
		err := client.WriteMessage(websocket.TextMessage, []byte(message))
		if err != nil {
			client.Close()
			delete(wsServer.clients, client)
		}
	}
}
