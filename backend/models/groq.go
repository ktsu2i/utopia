package models

type GroqRequest struct {
	Content string `json:"content"`
}

type GroqMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type Payload struct {
	GroqMessages []GroqMessage `json:"messages"`
	Model        string        `json:"model"`
}

type Choice struct {
	GroqMessage GroqMessage `json:"message"`
}

type GroqResponse struct {
	Choices []Choice `json:"choices"`
}
