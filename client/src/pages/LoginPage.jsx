import { useState } from "react";
import { useApp } from "../context/AppContext";
import { User, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const { loginUser, setActivePage } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validation States
  const [error, setError] = useState("");
  const [shakeFields, setShakeFields] = useState(false);

  const triggerError = (msg) => {
    setError(msg);
    setShakeFields(true);
    setTimeout(() => setShakeFields(false), 500);
    // Auto-dismiss alert after 3.5 seconds
    setTimeout(() => setError(""), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() && !password.trim()) {
      triggerError("Please enter your username and password.");
      return;
    }
    if (!username.trim()) {
      triggerError("Username field cannot be left blank.");
      return;
    }
    if (!password.trim()) {
      triggerError("Password field cannot be left blank.");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await loginUser(username.trim().toLowerCase(), password);
      if (!success) {
        triggerError("Invalid username or password. Please try again.");
      }
    } catch (err) {
      console.error(err);
      triggerError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex-1 w-full bg-[#121212] flex flex-col overflow-y-auto select-none font-sans relative h-full transition-all ${shakeFields ? "animate-shake" : ""}`}>
      {/* Slide-Down iOS Alert Banner */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-rose-500/90 backdrop-blur-md border border-rose-600 text-white text-xs font-semibold py-3.5 px-4 rounded-xl flex items-center gap-2 shadow-2xl animate-slide-down z-50">
          <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-white animate-bounce" />
          <span>{error}</span>
        </div>
      )}

      {/* Banner Section */}
      <div className="h-52 relative bg-neutral-900 overflow-hidden shrink-0">
        <img 
          src="https://i.pinimg.com/1200x/74/ad/30/74ad30304ab6178512ebacaec33f282d.jpg" 
          alt="SNAPIX Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/35 to-transparent" />
        
        {/* Logo / Branding */}
        <div className="absolute bottom-6 left-6">
          <h1 className="text-3xl font-black text-white tracking-widest uppercase">
            SNAP<span className="text-rose-500 bg-clip-text">IX</span>
          </h1>
          <p className="text-[11px] text-neutral-400 font-medium tracking-wide mt-1">
            Connect and share your moments in style
          </p>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1 p-6 flex flex-col justify-between">
        {/* Top Section: Input Fields */}
        <div className="space-y-5 flex-1 pt-4">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 pl-1">
              Username
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-4 w-4 h-4 text-neutral-500" />
              <input 
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-955/40 border border-neutral-800 rounded-xl py-3.5 pl-11 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors font-medium font-sans"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center pl-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Password
              </label>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-neutral-500" />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-955/40 border border-neutral-800 rounded-xl py-3.5 pl-11 pr-11 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors font-medium font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-neutral-500 hover:text-neutral-300 transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Actions */}
        <div className="space-y-4 pt-6 pb-2 shrink-0">
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:from-neutral-900 disabled:to-neutral-900 disabled:text-neutral-600 text-xs font-bold rounded-xl text-white shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Log In Account</span>
            )}
          </button>

          {/* Navigation Toggle */}
          <div className="text-center select-none">
            <p className="text-[10px] text-neutral-500 font-semibold font-sans">
              Don't have an account?{" "}
              <button 
                type="button" 
                onClick={() => setActivePage("register")}
                className="text-rose-500 hover:underline font-bold transition-all ml-0.5"
              >
                Create Register
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
  
