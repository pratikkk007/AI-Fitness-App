const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");

router.post("/generate-plan", authMiddleware, async (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal) {
      return res.status(400).json({ message: "Goal is required" });
    }

    let lowerGoal = goal.toLowerCase();

    // 🔥 NORMALIZATION (VERY IMPORTANT)
    let normalizedGoal = lowerGoal
      .replace("dumbell", "dumbbell")
      .replace("pushup", "push up")
      .replace("situp", "sit up")
      .replace("chest press", "bench press");

    let plan = `🔥 AI Fitness Coach Response for: ${goal}\n`;

    let exercise = null;

    // 🔥 STEP 1: DIRECT SEARCH
    try {
      const response = await axios.get(
        `https://exercisedb.p.rapidapi.com/exercises/name/${normalizedGoal}`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.RAPID_API_KEY,
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
        },
      );

      if (response.data && response.data.length > 0) {
        exercise = response.data[0];
      }
    } catch (err) {
      console.log("Direct search failed");
    }

    // 🔥 STEP 2: FALLBACK PARTIAL SEARCH
    if (!exercise) {
      try {
        const response = await axios.get(
          "https://exercisedb.p.rapidapi.com/exercises",
          {
            headers: {
              "X-RapidAPI-Key": process.env.RAPID_API_KEY,
              "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
          },
        );

        const exercises = response.data;

        exercise = exercises.find(
          (ex) =>
            normalizedGoal.includes(ex.name.toLowerCase()) ||
            ex.name.toLowerCase().includes(normalizedGoal),
        );
      } catch (err) {
        console.log("Fallback search failed");
      }
    }

    // 🔥 STEP 3: IF FOUND → RETURN REAL DATA
    if (exercise) {
      return res.json({
        plan: `
🏋️ Exercise: ${exercise.name}

🎯 Target Muscle: ${exercise.target}

📝 Instructions:
${exercise.instructions.join("\n")}

💡 AI Insights:
- Maintain proper posture
- Focus on controlled reps
- Start light and increase gradually
`,
      });
    }

    // 🔥 STEP 4: FALLBACK AI LOGIC
    plan += `
🏋️ General Workout Plan:
- Strength training 4x/week
- Cardio 3x/week

🥗 Diet:
- High protein meals
- Balanced nutrition

💡 Tips:
- Stay consistent
- Sleep 7–8 hours
- Track progress weekly
`;

    if (normalizedGoal.includes("gain")) {
      plan += "\n🔥 Focus: Muscle Gain + Calorie Surplus";
    } else if (normalizedGoal.includes("weight loss")) {
      plan += "\n🔥 Focus: Fat Loss + Cardio";
    } else if (normalizedGoal.includes("abs")) {
      plan += "\n🔥 Focus: Core Training";
    }

    res.json({ plan });
  } catch (error) {
    console.error("Server Error:", error);

    res.status(500).json({
      message: "Something went wrong",
      plan: "Basic plan: Stay active and eat healthy",
    });
  }
});

module.exports = router;
