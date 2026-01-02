import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validators/loginSchema";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    console.log("Login Data:", data);
    // TODO: call your login API here
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl bg-gray-100 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE - FORM */}
        <div className="p-10">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Welcome Back 👋
          </h1>
          <p className="text-gray-500 mb-8">
            Login to access your dashboard
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* PHONE */}
            <div>
              <label className="label">Phone</label>
              <input
                {...register("phone")}
                placeholder="078xxxxxxx"
                type="text"
                className={`input ${errors.phone ? "ring-red-400" : "focus:ring-blue-500"
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
                className={`input ${errors.password ? "ring-red-400" : "focus:ring-blue-500"
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
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn w-full flex justify-center items-center gap-2"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE - IMAGE / TEXT */}
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
