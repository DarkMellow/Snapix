import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { User, Lock, Mail, Eye, EyeOff, AlertTriangle, Camera } from "lucide-react";

export default function RegisterPage() {
  const { registerUser, setActivePage } = useApp();
  const fileInputRef = useRef(null);

  // Form Fields
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation States
  const [error, setError] = useState("");
  const [shakeFields, setShakeFields] = useState(false);

  // Inline Error States
  const [usernameError, setUsernameError] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const triggerError = (msg) => {
    setError(msg);
    setShakeFields(true);
    setTimeout(() => setShakeFields(false), 500);
    // Auto-dismiss alert after 3.5 seconds
    setTimeout(() => setError(""), 3500);
  };

  const validateUsername = (val) => {
    if (!val.trim()) {
      setUsernameError("Username is required.");
      return false;
    }
    if (val.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters long.");
      return false;
    }
    if (val.trim().length > 16) {
      setUsernameError("Username cannot exceed 16 characters.");
      return false;
    }
    const usernameRegex = /^[a-z0-9_]+$/;
    if (!usernameRegex.test(val.trim())) {
      setUsernameError("Only lowercase letters, numbers, and underscores allowed.");
      return false;
    }
    const hasLetter = /[a-z]/;
    if (!hasLetter.test(val.trim())) {
      setUsernameError("Username must contain at least one letter.");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validateDisplayName = (val) => {
    if (!val.trim()) {
      setDisplayNameError("Display Name is required.");
      return false;
    }
    setDisplayNameError("");
    return true;
  };

  const validateEmailField = (val) => {
    if (!val.trim()) {
      setEmailError("Email address is required.");
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(val.trim())) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePasswordField = (val) => {
    if (!val) {
      setPasswordError("Password is required.");
      return false;
    }
    if (val.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isUsernameValid = validateUsername(username);
    const isDisplayNameValid = validateDisplayName(displayName);
    const isEmailValid = validateEmailField(email);
    const isPasswordValid = validatePasswordField(password);

    if (!isUsernameValid || !isDisplayNameValid || !isEmailValid || !isPasswordValid) {
      setShakeFields(true);
      setTimeout(() => setShakeFields(false), 500);
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await registerUser({
        username: username.trim(),
        displayName: displayName.trim(),
        email: email.trim(),
        password,
        profilePicFile: selectedFile
      });

      if (!success) {
        triggerError("Username or email already exists. Please try another.");
      }
    } catch (err) {
      console.error(err);
      triggerError(err.message || "Registration failed. Please try again.");
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

      {/* Banner with Avatar Overlay */}
      <div className="h-44 relative bg-neutral-900 shrink-0">
        <img 
          src="https://i.pinimg.com/1200x/74/ad/30/74ad30304ab6178512ebacaec33f282d.jpg" 
          alt="SNAPIX Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#121212] via-[#121212]/35 to-transparent" />
        
        {/* Avatar Selector Circle */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20">
          <input 
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div 
            onClick={handleAvatarClick}
            className="w-20 h-20 rounded-full border-4 border-[#121212] bg-neutral-950 overflow-hidden cursor-pointer relative group shadow-lg"
          >
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Avatar Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 hover:bg-neutral-850 transition-colors">
                <Camera className="w-5 h-5 text-neutral-400 group-hover:text-rose-500 transition-colors" />
                <span className="text-[7px] text-neutral-500 font-bold uppercase tracking-wider mt-1">Photo</span>
              </div>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1 p-6 flex flex-col justify-between">
        {/* Top Section: Inputs */}
        <div className="space-y-4 flex-1 pt-12">
          {/* Username Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 pl-1">
              Username
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-4 w-4 h-4 text-neutral-500" />
              <input 
                type="text"
                placeholder="Choose a username"
                value={username}
                maxLength={16}
                onChange={(e) => {
                  const val = e.target.value;
                  setUsername(val);
                  validateUsername(val);
                }}
                className={`w-full bg-neutral-955/40 border rounded-xl py-2.5 pl-11 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none transition-colors font-medium font-sans ${
                  usernameError ? "border-rose-500 focus:border-rose-500" : "border-neutral-800 focus:border-rose-500"
                }`}
              />
            </div>
            {usernameError && (
              <p className="text-[10px] text-rose-500 font-semibold pl-1 mt-0.5 animate-slide-down">
                {usernameError}
              </p>
            )}
          </div>

          {/* Display Name Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 pl-1">
              Display Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-4 w-4 h-4 text-neutral-500" />
              <input 
                type="text"
                placeholder="What should we call you?"
                value={displayName}
                onChange={(e) => {
                  const val = e.target.value;
                  setDisplayName(val);
                  validateDisplayName(val);
                }}
                className={`w-full bg-neutral-955/40 border rounded-xl py-2.5 pl-11 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none transition-colors font-medium font-sans ${
                  displayNameError ? "border-rose-500 focus:border-rose-500" : "border-neutral-800 focus:border-rose-500"
                }`}
              />
            </div>
            {displayNameError && (
              <p className="text-[10px] text-rose-500 font-semibold pl-1 mt-0.5 animate-slide-down">
                {displayNameError}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 pl-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-neutral-500" />
              <input 
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  const val = e.target.value;
                  setEmail(val);
                  validateEmailField(val);
                }}
                className={`w-full bg-neutral-955/40 border rounded-xl py-2.5 pl-11 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none transition-colors font-medium font-sans ${
                  emailError ? "border-rose-500 focus:border-rose-500" : "border-neutral-800 focus:border-rose-500"
                }`}
              />
            </div>
            {emailError && (
              <p className="text-[10px] text-rose-500 font-semibold pl-1 mt-0.5 animate-slide-down">
                {emailError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 pl-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-neutral-500" />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  validatePasswordField(val);
                }}
                className={`w-full bg-neutral-955/40 border rounded-xl py-2.5 pl-11 pr-11 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none transition-colors font-medium font-sans ${
                  passwordError ? "border-rose-500 focus:border-rose-500" : "border-neutral-800 focus:border-rose-500"
                }`}
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
            {passwordError && (
              <p className="text-[10px] text-rose-500 font-semibold pl-1 mt-0.5 animate-slide-down">
                {passwordError}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Section: Actions */}
        <div className="space-y-4 pt-6 pb-2 shrink-0">
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3.5 bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:from-neutral-900 disabled:to-neutral-900 disabled:text-neutral-600 text-xs font-bold rounded-xl text-white shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Create Register Account</span>
            )}
          </button>

          {/* Navigation Toggle */}
          <div className="text-center select-none">
            <p className="text-[10px] text-neutral-500 font-semibold font-sans">
              Already have an account?{" "}
              <button 
                type="button" 
                onClick={() => setActivePage("login")}
                className="text-rose-500 hover:underline font-bold transition-all ml-0.5"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
