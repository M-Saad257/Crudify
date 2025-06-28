import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    console.log("🟨 Sending data:", data);

    try {
      const response = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password
        })
      });

      const result = await response.json();
      console.log("🟢 Response status:", response.status);
      console.log("🟢 Server response:", result);

      if (response.ok && result.userId) {
        console.log("✅ Redirecting to dashboard with ID:", result.userId);

        localStorage.setItem("email", data.email);
        localStorage.setItem("username", data.username);
        localStorage.setItem("profileImage", ""); // empty by default

        reset();
        navigate(`/dashboard/${result.userId}`);
      } else {
        console.warn("⚠️ Registration failed, no userId in result.");
        alert(result.error || "Failed to register.");
      }

    } catch (error) {
      console.error("❌ Network/server error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="signup-section">
      <div className="signtxt">
        <h2>Sign Up</h2>
        <p>Join us to manage your data smarter.</p>
      </div>

      <div className="form">
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <input
              {...register("username", { required: "Name is required" })}
              placeholder="Your Name"
            />
            {errors.username && <p className="error">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format"
                }
              })}
              placeholder="you@example.com"
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required"
                  }
                })}
                placeholder="Create a password"
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer"
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>

          <button type="submit" className="btn">Register</button>
          <p className="redirect-link">
            Already registered? <Link to="/signin">Click here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;