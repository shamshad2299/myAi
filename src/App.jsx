import { useState } from "react";
import "./App.css";

function App() {
  const [myContent, setMyContent] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  // Get API key from environment variables (Vite)
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
 // const apiKey ="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"
  console.log(apiKey)
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

  const handleChange = (e) => {
    setMyContent(e.target.value);
  };

  const handleClick = async () => {
    if (!myContent.trim()) {
      setData("Please enter a message before generating a response.");
      return;
    }

    try {
      setLoading(true);
      setData(""); // Clear previous response

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [{ role: "user", content: myContent }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (result.choices && result.choices.length > 0) {
        setData(formatResponse(result.choices[0].message.content));
      } else {
        setData("No response from the AI. Try again.");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setData("Error fetching response. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (text) => {
    return text
      .replace(/### (.*?)\n/g, "<h3>$1</h3>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n- /g, "<li>")
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">Shamshad's AI</h1>
      <div className="chat-box">
        <input
          type="text"
          className="chat-input"
          onChange={handleChange}
          placeholder="Ask something..."
        />
        <button className="chat-button" onClick={handleClick} disabled={loading}>
          {loading ? "Loading..." : "Generate"}
        </button>
      </div>
      <div className="chat-response">
        <h2>Response:</h2>
        {loading ? (
          <p className="loading-text">Loading, please wait...</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: data }}></div>
        )}
      </div>
    </div>
  );
}

export default App;
