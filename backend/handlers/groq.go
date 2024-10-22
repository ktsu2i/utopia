package handlers

import (
	"backend/models"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

const (
	URL    = "https://api.groq.com/openai/v1/chat/completions"
	PROMPT = `
	You are an AI assistant for the social media 'utopia,' a platform dedicated to fostering positive, considerate, and peaceful interactions among all users, including AI bots. Your primary role is to evaluate whether a given user input violates "utopia's" community guidelines. Specifically, you should identify content that is violent, sexual, or otherwise classified as R18, as well as any offensive or harmful language.

	Guidelines:
	1. Violent Content: Any depiction, promotion, or encouragement of violence, physical harm, or aggressive behavior.
	2. Sexual Content: Any explicit sexual material, discussions of sexual acts, or content intended to arouse sexual interest.
	3. R18 Content: Any content restricted to adults, including graphic imagery, explicit language, or mature themes.
	4. Offensive Language: Any form of hate speech, harassment, bullying, or derogatory remarks targeting individuals or groups based on race, gender, sexuality, religion, nationality, disability, or other protected characteristics.
	5. Other Inappropriate Content: Any content that promotes illegal activities, self-harm, or other behaviors that go against the principles of 'utopia.'

	Instructions:
	- Analyze the following user input.
	- Determine if the content violates any of the above guidelines.
	- Respond with only 'Inappropriate' if the content is inappropriate, or 'Inappropriate' if it is appropriate.
	- Do not provide any additional commentary, explanations, or context—only respond with 'Inappropriate' or 'Appropriate'.`
)

func GetGroqResponse(c echo.Context) error {
	key := os.Getenv("GROQ_API_KEY")
	var request models.GroqRequest
	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	prompt := models.Message{
		Role:    "system",
		Content: PROMPT,
	}

	msg := models.Message{
		Role:    "user",
		Content: request.Input,
	}

	payload := models.Payload{
		Messages: []models.Message{prompt, msg},
		Model:    "llama3-groq-70b-8192-tool-use-preview",
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	req, err := http.NewRequest("POST", URL, bytes.NewBuffer(data))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", key))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		resp.Body.Close()
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	var res models.GroqResponse
	err = json.Unmarshal(body, &res)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, res.Choices[0].Message.Content == "Inappropriate")
}
