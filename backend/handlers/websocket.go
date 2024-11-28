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

type ChatWebSocketServer struct {
	clients map[string]map[*websocket.Conn]bool
	mu      sync.Mutex
}

type NotificationWebSocketServer struct {
	clients map[string]map[*websocket.Conn]bool
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

var chatServer = ChatWebSocketServer{
	clients: make(map[string]map[*websocket.Conn]bool),
}

var notificationServer = NotificationWebSocketServer{
	clients: make(map[string]map[*websocket.Conn]bool),
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

func HandleChatWebSocket(c echo.Context) error {
	userID := c.QueryParam("userId")

	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()

	chatServer.mu.Lock()
	if chatServer.clients[userID] == nil {
		chatServer.clients[userID] = make(map[*websocket.Conn]bool)
	}
	chatServer.clients[userID][ws] = true
	chatServer.mu.Unlock()

	defer func() {
		chatServer.mu.Lock()
		delete(chatServer.clients[userID], ws)
		if len(chatServer.clients[userID]) == 0 {
			delete(chatServer.clients, userID)
		}
		chatServer.mu.Unlock()
	}()

	for {
		_, _, err := ws.ReadMessage()
		if err != nil {
			break
		}
	}

	return nil
}

func HandleNotificationWebSocket(c echo.Context) error {
	userID := c.QueryParam("userId")

	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()

	notificationServer.mu.Lock()
	if notificationServer.clients[userID] == nil {
		notificationServer.clients[userID] = make(map[*websocket.Conn]bool)
	}
	notificationServer.clients[userID][ws] = true
	notificationServer.mu.Unlock()

	defer func() {
		notificationServer.mu.Lock()
		delete(notificationServer.clients[userID], ws)
		if len(notificationServer.clients[userID]) == 0 {
			delete(notificationServer.clients, userID)
		}
		notificationServer.mu.Unlock()
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

func NotifyChatClients(senderID, receiverID, message string) {
	chatServer.mu.Lock()
	defer chatServer.mu.Unlock()

	notify := func(userID string) {
		if clients, ok := chatServer.clients[userID]; ok {
			for conn := range clients {
				err := conn.WriteMessage(websocket.TextMessage, []byte(message))
				if err != nil {
					conn.Close()
					delete(clients, conn)
				}
			}
		}
	}

	notify(senderID)
	notify(receiverID)
}

func NotifyNotificationClients(userID, message string) {
	notificationServer.mu.Lock()
	defer notificationServer.mu.Unlock()

	if clients, ok := notificationServer.clients[userID]; ok {
		for conn := range clients {
			err := conn.WriteMessage(websocket.TextMessage, []byte(message))
			if err != nil {
				conn.Close()
				delete(clients, conn)
			}
		}
	}
}
