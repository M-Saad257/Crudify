import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Login successful!");

        // ✅ Save user data in localStorage
        localStorage.setItem("email", result.user.email);
        localStorage.setItem("profileImage", result.user.profileImage || "");
        localStorage.setItem("username", result.user.username);

        // ✅ Redirect after saving
        window.location.href = `/dashboard/${result.user._id}`;
      } else {
        alert(result.error || "Invalid credentials");
        if (response.status === 404) {
          window.location.href = "/signup";
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="signin-section">
      <div className="signtxt">
        <h2>Sign In</h2>
        <p>Welcome back! Log in to continue.</p>
      </div>

      <div className="form">
        <form onSubmit={handleSubmit(onSubmit)}>

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
                placeholder="Enter your password"
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

          <button type="submit" className="btn">Login</button>
          <p className="redirect-link">
            Don't have an account? <Link to="/signup">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;