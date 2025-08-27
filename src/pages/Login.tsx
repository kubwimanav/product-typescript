import { useState, type ChangeEvent, type FormEvent} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";


interface FormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

const Login = () => {
  const { setUser } = useAuth();
 const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({ 
    username: "", 
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : 
              name === "username" ? value.toLowerCase() : value,
    }));
  };

  const validate = (): FormErrors => {
    const errors: FormErrors = {};
    if (!(formData.username)) {
      errors.username = "Please enter a valid Username";
    }
    
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch('https://dummyjson.com/user/login', {  // Fixed endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,  // DummyJSON expects username
          password: formData.password
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || 
          `Login failed (${res.status} ${res.statusText})`
        );
      }

      const data = await res.json();
      setUser(data);

      if (formData.rememberMe && data.token) {
        localStorage.setItem("authToken", data.token);
      } else if (data.token) {
        sessionStorage.setItem("authToken", data.token);
      }
      
    


      navigate("/products", { replace: true });
      
    } catch (error) {
      const message = error instanceof Error 
        ? (error.message.includes("Failed to fetch") 
          ? "Network error - please try again" 
          : "Invalid credentials")
        : "Login failed";
      
      setErrors({ general: message });
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-dvh bg-primaryColor-50">
      <div className="flex flex-col gap-6 items-center justify-center ">
        <span className="text-2xl font-semibold p-2 ">Login Here</span>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 items-center justify-center bg-white  py-8 px-10 rounded-2xl"
          aria-label="Login form"
        >
          <div className="flex flex-col  w-100 gap-1">
            <Input
              label="Username"
              type="username"
              value={formData.username}
              onChange={handleChange}
              name="username"
              aria-invalid={!!errors.username}
              aria-describedby="email-error"
            />
            {errors.username && (
              <p id="username-error" className="text-sm text-red-600">
                {errors.username}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 w-100">
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                name="password"
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-10 text-sm text-primaryColor-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye /> }
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-sm text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          {errors.general && (
            <p className="text-sm text-red-600 text-center">{errors.general}</p>
          )}

          <Button
            label={loading ? "Logging in..." : "Log in"}
            type="submit"
            className="w-full"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;