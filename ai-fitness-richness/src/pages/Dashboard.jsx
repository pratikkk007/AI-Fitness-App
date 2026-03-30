import { useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  // BMI states
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");

  // Calories states
  const [age, setAge] = useState("");
  const [calories, setCalories] = useState("");

  const generatePlan = async () => {
    try {
      const res = await API.post("/ai/generate-plan", { goal });
      setPlan(res.data.plan);
      setHasGenerated(true);
    } catch {
      alert("Error generating plan");
    }
  };

  const resetPlan = () => {
    setGoal("");
    setPlan("");
    setHasGenerated(false);
  };

  // BMI CALCULATION
  const calculateBMI = () => {
    if (!height || !weight) {
      alert("Please enter height and weight");
      return;
    }

    const h = height / 100;
    const bmiValue = (weight / (h * h)).toFixed(2);

    let category = "";

    if (bmiValue < 18.5) {
      category = "Underweight";
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      category = "Normal";
    } else if (bmiValue >= 25 && bmiValue < 30) {
      category = "Overweight";
    } else {
      category = "Obese";
    }

    setBmi(`Your BMI is ${bmiValue} (${category})`);
  };

  // CALORIE CALCULATION (simple formula)
  const calculateCalories = () => {
    const cal = 10 * weight + 6.25 * height - 5 * age + 5;
    setCalories(Math.round(cal));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-8">
        💪 AI Fitness Coach Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* BMI CARD */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">📊 BMI Calculator</h2>

          <input
            placeholder="Height (cm)"
            className="p-2 w-full mb-3 text-black rounded"
            onChange={(e) => setHeight(e.target.value)}
          />

          <input
            placeholder="Weight (kg)"
            className="p-2 w-full mb-3 text-black rounded"
            onChange={(e) => setWeight(e.target.value)}
          />

          <button
            onClick={calculateBMI}
            className="bg-blue-500 w-full p-2 rounded"
          >
            Calculate BMI
          </button>

          {bmi && <p className="mt-3 font-semibold text-lg">{bmi}</p>}
        </div>

        {/* AI PLAN CENTER */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl text-center">
          <input
            placeholder="Enter goal (abs, muscle, weight loss)"
            className="p-3 w-full text-black rounded mb-3"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={hasGenerated}
          />

          {!hasGenerated ? (
            <button
              onClick={generatePlan}
              className="bg-blue-500 w-full p-3 rounded"
            >
              Generate Plan 🚀
            </button>
          ) : (
            <button
              onClick={resetPlan}
              className="bg-green-500 w-full p-3 rounded"
            >
              Generate Another Plan 🔄
            </button>
          )}

          {plan && (
            <div className="mt-4 text-sm whitespace-pre-line">{plan}</div>
          )}
        </div>

        {/* CALORIE CARD */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">🔥 Calorie Calculator</h2>

          <input
            placeholder="Age"
            className="p-2 w-full mb-3 text-black rounded"
            onChange={(e) => setAge(e.target.value)}
          />

          <input
            placeholder="Height (cm)"
            className="p-2 w-full mb-3 text-black rounded"
            onChange={(e) => setHeight(e.target.value)}
          />

          <input
            placeholder="Weight (kg)"
            className="p-2 w-full mb-3 text-black rounded"
            onChange={(e) => setWeight(e.target.value)}
          />

          <button
            onClick={calculateCalories}
            className="bg-orange-500 w-full p-2 rounded"
          >
            Calculate Calories
          </button>

          {calories && <p className="mt-3">Daily Calories: {calories} kcal</p>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
