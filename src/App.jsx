import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [myContent, setMyContent] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = "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";
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

  const handleChange = (e) => {
    setMyContent(e.target.value);
  };

  const handleClick = async () => {
    try {
      setLoading(true);
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

      const result = await response.json();
      if (result.choices && result.choices.length > 0) {
        setData(formatResponse(result.choices[0].message.content));
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setData("Error fetching response. Please try again.");
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
      <h1 className="chat-title">Shamshad's AI </h1>
      <div className="chat-box">
        <input
          type="text"
          className="chat-input"
          onChange={handleChange}
          placeholder="Ask something..."
        />
        <button className="chat-button" onClick={handleClick}>
          Generate
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