import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  SignupRequest,
  SignupResponse,
} from "../types/auth";
function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const signupData: SignupRequest = {
      name,
      email,
      password,
    };

    try {
      const res = await axios.post<SignupResponse>(
        "https://ai-fitness-backend-2328.onrender.com/api/auth/signup",
        signupData
      );

      alert(
        res.data.message || "Signup successful ✅"
      );

      navigate("/login");
    } catch (error: unknown) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            "Signup failed ❌"
        );
      } else {
        alert("Server not reachable ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded shadow w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {/* 🔥 Login link */}
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
