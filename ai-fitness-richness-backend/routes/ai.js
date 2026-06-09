const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");

router.post("/generate-plan", authMiddleware, async (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal) {
      return res.status(400).json({
        message: "Goal is required",
      });
    }

    let normalizedGoal = goal.toLowerCase().trim();

    // NORMALIZATION
    normalizedGoal = normalizedGoal
      .replace("dumbell", "dumbbell")
      .replace("pushup", "push up")
      .replace("situp", "sit up")
      .replace("chest press", "bench press");

    // =========================
    // NUTRITION KNOWLEDGE BASE
    // =========================

    const nutritionResponses = {
      protein: `
🥩 PROTEIN GUIDE

Best Sources:
• Chicken Breast
• Eggs
• Fish
• Whey Protein
• Paneer
• Tofu
• Greek Yogurt

Daily Intake:
• Muscle Gain: 1.8-2.2g/kg
• Fat Loss: 1.6-2.0g/kg

Tips:
• Include protein in every meal
• Post-workout protein helps recovery
`,

      creatine: `
⚡ CREATINE GUIDE

Recommended:
• Creatine Monohydrate

Dosage:
• 3-5g daily

Benefits:
• Increased strength
• Better recovery
• Improved performance

Tip:
• Take consistently every day
`,

      calories: `
🔥 CALORIE GUIDE

Weight Loss:
• 300-500 calorie deficit

Maintenance:
• Maintain current calories

Muscle Gain:
• 200-400 calorie surplus

Tip:
• Track calories consistently
`,

      nutrition: `
🥗 NUTRITION BASICS

Eat More:
• Lean proteins
• Fruits
• Vegetables
• Whole grains

Limit:
• Sugary drinks
• Ultra processed foods

Rule:
• 80% clean eating
• 20% flexibility
`,

      supplements: `
💊 TOP FITNESS SUPPLEMENTS

1. Whey Protein
2. Creatine Monohydrate
3. Fish Oil
4. Multivitamin

Remember:
Supplements support a good diet.
`,

      diet: `
🍽 SAMPLE DIET PLAN

Breakfast:
• Eggs + Oats

Lunch:
• Rice + Chicken/Paneer

Snack:
• Fruit + Nuts

Dinner:
• Protein + Vegetables

Hydration:
• 3-4L water daily
`,
    };

    for (const key in nutritionResponses) {
      if (normalizedGoal.includes(key)) {
        return res.json({
          plan: nutritionResponses[key],
        });
      }
    }

    // =========================
    // GOAL MAPPING
    // =========================

    const goalMap = {
      abs: "plank",
      core: "plank",
      chest: "bench press",
      shoulders: "shoulder press",
      biceps: "barbell curl",
      triceps: "tricep pushdown",
      back: "deadlift",
      legs: "squat",
      cardio: "jump rope",
      fatloss: "burpee",
      "fat loss": "burpee",
      weightloss: "burpee",
      "weight loss": "burpee",
      muscle: "bench press",
      "muscle gain": "bench press",
      musclegain: "bench press",
      strength: "deadlift",
    };

    if (goalMap[normalizedGoal]) {
      normalizedGoal = goalMap[normalizedGoal];
    }

    let exercises = [];

    // =========================
    // DIRECT SEARCH
    // =========================

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

      if (response.data?.length > 0) {
        exercises = response.data.slice(0, 3);
      }
    } catch (err) {
      console.log("Direct search failed");
    }

    // =========================
    // PARTIAL SEARCH
    // =========================

    if (exercises.length === 0) {
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

        exercises = response.data
          .filter(
            (ex) =>
              ex.name.toLowerCase().includes(normalizedGoal) ||
              normalizedGoal.includes(ex.name.toLowerCase()),
          )
          .slice(0, 3);
      } catch (err) {
        console.log("Fallback search failed");
      }
    }

    // =========================
    // RETURN EXERCISE RESULTS
    // =========================

    if (exercises.length > 0) {
      let plan = `🔥 AI Fitness Coach Response for: ${goal}\n\n`;

      exercises.forEach((exercise, index) => {
        plan += `
🏋️ Exercise ${index + 1}: ${exercise.name}

🎯 Target Muscle: ${exercise.target}
⚙️ Equipment: ${exercise.equipment}
🧍 Body Part: ${exercise.bodyPart}

📝 Instructions:
${exercise.instructions?.join("\n") || "Follow proper form."}

-----------------------------------
`;
      });

      plan += `
💡 Coaching Tips

• Warm up before training
• Use proper form
• Progressive overload is key
• Sleep 7-9 hours
• Stay hydrated
`;

      return res.json({ plan });
    }

    // =========================
    // SMART WORKOUT PLANS
    // =========================

    let plan = `🔥 AI Fitness Coach Response for: ${goal}\n\n`;

    if (normalizedGoal.includes("muscle") || normalizedGoal.includes("gain")) {
      plan += `
💪 MUSCLE GAIN PROGRAM

Monday:
• Bench Press
• Incline Dumbbell Press
• Tricep Pushdowns

Tuesday:
• Deadlift
• Pull Ups
• Barbell Rows

Wednesday:
• Recovery

Thursday:
• Squats
• Lunges
• Leg Press

Friday:
• Shoulder Press
• Lateral Raises

Nutrition:
• Calorie Surplus
• High Protein
`;
    } else if (
      normalizedGoal.includes("weight") ||
      normalizedGoal.includes("fat")
    ) {
      plan += `
🔥 FAT LOSS PROGRAM

Workout:
• Cardio 4x/week
• Strength Training 3x/week

Diet:
• Calorie Deficit
• High Protein
• Plenty of Vegetables

Goal:
• Lose 0.5kg/week
`;
    } else if (
      normalizedGoal.includes("abs") ||
      normalizedGoal.includes("core")
    ) {
      plan += `
🏆 CORE PROGRAM

Exercises:
• Front Plank
• Side Plank
• Leg Raises
• Russian Twists
• Mountain Climbers

Frequency:
• 3-4x/week
`;
    } else {
      plan += `
🏋️ GENERAL FITNESS PLAN

Monday:
• Upper Body

Tuesday:
• Cardio

Wednesday:
• Lower Body

Thursday:
• Recovery

Friday:
• Full Body

Saturday:
• Cardio

Sunday:
• Rest

Tips:
• Stay consistent
• Track progress
• Sleep well
`;
    }

    return res.json({ plan });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
      plan: "Stay active, eat healthy, and remain consistent.",
    });
  }
});

module.exports = router;
