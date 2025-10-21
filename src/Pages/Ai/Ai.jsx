import { useEffect, useState } from "react";
import { getAllFood } from "../../Firebase/firebaseAdminFunction";
import { GoogleGenAI } from "@google/genai"; // ✅ Updated SDK
import Navbar from "../../Components/Navbar/Navbar";
import Card from "../../Components/Card/Card";
import "./Ai.css";
import { toast } from "react-toastify";

export default function Ai() {
  const [food, setFood] = useState([]);
  const [recommendedFood, setRecommendedFood] = useState([]);
  const [mood, setMood] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [loading, setLoading] = useState(false);

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMENI_API_KEY }); // updated SDK

  useEffect(() => {
    const getFood = async () => {
      const data = await getAllFood();
      setFood(data);
    };
    getFood();
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();

    if (!mood || !numberOfPeople) {
      toast.error("Please select both mood and number of people.");
      return;
    }

    const prompt = `
You are a food recommendation system. Based on a user's mood and number of people, choose the best food items from the given data.

Requirements:
- Output ONLY a JSON array (e.g. [ { "name": "...", "price": ..., "id": "...", ... } ]).
- DO NOT wrap the JSON in triple backticks or markdown formatting.
- No explanation or text.
- Use only food items from the provided data.
- Match the food to the mood.
- Use same field names as in the input (like name, price, id, category, etc.)

Mood: ${mood}
People: ${numberOfPeople}

Food data:
${JSON.stringify(food, null, 2)}
`;

    try {
      setLoading(true);

      // ✅ Updated API call
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      console.log("Full AI response:", result);

      let responseText =
        result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // ✅ Strip triple backticks and optional 'json' tag
      responseText = responseText.trim();
      if (responseText.startsWith("```")) {
        responseText = responseText
          .replace(/^```(?:json)?/, "")
          .replace(/```$/, "")
          .trim();
      }

      const parsed = JSON.parse(responseText);
      setRecommendedFood(parsed);
    } catch (error) {
      console.error("Failed to get or parse AI response:", error);
      toast.error("Failed to get AI recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      <Navbar />
      <div className="ai-container">
        <form className="ai-form">
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="">Select Mood</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="tired">Tired</option>
            <option value="excited">Excited</option>
            <option value="celebrating">Celebrating</option>
          </select>
          <select
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
          >
            <option value="">Number of People</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4+</option>
          </select>

          <button onClick={handleClick}>Get Food Recommendations</button>
        </form>

        <h2>Recommended Foods:</h2>
        {loading && <p className="ai-loading">Loading recommendations...</p>}
        {!loading && recommendedFood.length === 0 && (
          <p className="ai-loading">No recommendations yet.</p>
        )}

        <div className="card-grid">
          {recommendedFood.map((item, i) => (
            <Card
              key={i}
              name={item.name || item.foodName || "Unnamed Dish"}
              image_link={item.imageUrl || ""}
              des={item.description || ""}
              price={item.price || 0}
              foodId={item.id || "ai-generated-food"}
              quantity={0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
