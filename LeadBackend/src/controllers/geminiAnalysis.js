
// geminiAnalysis.js
import fetch from "node-fetch"; // install if not in Node 18+

async function analyzeTextWithGemini(inputText) {
  const apiKey = "api-key"; // replace with your key
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    apiKey;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Analyze the following text and return JSON ONLY in this format:
            {
              "key_topics": [list of important keywords or topics],
              "summary": "short summary of the text",
              "type": "positive | negative | neutral"
            }

            Text: """${inputText}"""`,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    let outputText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Clean out ```json ... ``` wrappers if present
    outputText = outputText.replace(/```json|```/g, "").trim();

    // Extract JSON object safely
    const jsonMatch = outputText.match(/\{[\s\S]*\}/);
    let jsonResult = {};

    if (jsonMatch) {
      jsonResult = JSON.parse(jsonMatch[0]);
    }

    return jsonResult;
  } catch (error) {
    console.error("Error analyzing text:", error);
    return null;
  }
}

//****************** */
/**
 * 
 * 
 * (async () => {
  const result = await analyzeTextWithGemini(
    "The product was amazing but shipping was delayed."
  );
  console.log("result ==> ", result);
})();


 */

export default analyzeTextWithGemini;
