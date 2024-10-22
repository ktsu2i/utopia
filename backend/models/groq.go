package models

type GroqRequest struct {
	Input string `json:"input"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type Payload struct {
	Messages []Message `json:"messages"`
	Model    string    `json:"model"`
}

type Choice struct {
	Message Message `json:"message"`
}

type GroqResponse struct {
	Choices []Choice `json:"choices"`
}
