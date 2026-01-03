import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validators/loginSchema";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const apiurl = import.meta.env.VITE_API_URL

  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosInstance.post("/user/login", formData);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Login failed");
    },
  });

  const onSubmit = (data) => {
    setError(null);
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl bg-gray-100 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT */}
        <div className="p-10">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Welcome Back 👋
          </h1>
          <p className="text-gray-500 mb-8">
            Login to access your dashboard
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* PHONE */}
            <div>
              <label className="label">Phone</label>
              <input
                {...register("phone")}
                placeholder="078xxxxxxx"
                type="text"
                disabled={loginMutation.isPending}
                className={`input ${
                  errors.phone ? "ring-red-400" : "focus:ring-blue-500"
                }`}
              />
              {errors.phone && (
                <p className="error">{errors.phone.message}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="label">Password</label>
              <input
                {...register("password")}
                placeholder="********"
                type="password"
                disabled={loginMutation.isPending}
                className={`input ${
                  errors.password ? "ring-red-400" : "focus:ring-blue-500"
                }`}
              />
              {errors.password && (
                <p className="error">{errors.password.message}</p>
              )}
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <a
                href="#"
                className={`text-sm ${
                  loginMutation.isPending
                    ? "text-gray-400 pointer-events-none"
                    : "text-blue-600 hover:underline"
                }`}
              >
                Forgot password?
              </a>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="btn w-full flex justify-center items-center gap-2 disabled:opacity-60"
            >
              {loginMutation.isPending && (
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center justify-center bg-blue-500 text-white p-10">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Secure Access</h2>
            <p className="text-blue-100">
              Manage your account, track activities, and stay connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
