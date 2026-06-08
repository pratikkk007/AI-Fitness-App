import { useState } from "react";
import API from "../services/api";
import {
  GeneratePlanRequest,
  GeneratePlanResponse,
} from "../types/dashboard";

function Dashboard() {
  const [goal, setGoal] = useState<string>("");
  const [plan, setPlan] = useState<string>("");
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [bmi, setBmi] = useState<string>("");

  const [age, setAge] = useState<string>("");
  const [calories, setCalories] = useState<string>("");

  const generatePlan = async (): Promise<void> => {
  try {
    const requestData: GeneratePlanRequest = {
      goal,
    };

    const res = await API.post<GeneratePlanResponse>(
      "/ai/generate-plan",
      requestData
    );

    setPlan(res.data.plan);
    setHasGenerated(true);
  } catch {
    alert("Error generating plan");
  }
};

  const resetPlan = (): void => {
    setGoal("");
    setPlan("");
    setHasGenerated(false);
  };

  const calculateBMI = (): void => {
  if (!height || !weight) {
    alert("Please enter height and weight");
    return;
  }

  const heightNum = Number(height);
  const weightNum = Number(weight);

  const h = heightNum / 100;

  const bmiValue = (
    weightNum /
    (h * h)
  ).toFixed(2);

  let category = "";

  if (Number(bmiValue) < 18.5) {
    category = "Underweight";
  } else if (Number(bmiValue) < 25) {
    category = "Normal";
  } else if (Number(bmiValue) < 30) {
    category = "Overweight";
  } else {
    category = "Obese";
  }

  setBmi(
    `Your BMI is ${bmiValue} (${category})`
  );
};

  const calculateCalories = (): void => {
  const ageNum = Number(age);
  const heightNum = Number(height);
  const weightNum = Number(weight);

  const cal =
    10 * weightNum +
    6.25 * heightNum -
    5 * ageNum +
    5;

  setCalories(
    String(Math.round(cal))
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-8">
        💪 AI Fitness Coach Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
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
