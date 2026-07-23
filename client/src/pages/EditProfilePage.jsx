import { useState } from "react";
import { useApp } from "../context/AppContext";
import { ChevronLeft, Bell, Save, Camera } from "lucide-react";



export default function EditProfilePage() {
  const { currentUser, updateProfile, setActivePage, setShowNotifications } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePic, setProfilePic] = useState(currentUser.profilePic);
  const [displayName, setDisplayName] = useState(currentUser.displayName || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Generate temporary preview URL for front-end mockup representation
      const previewUrl = URL.createObjectURL(file);
      setProfilePic(previewUrl);
      setError("");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Display name cannot be empty");
      return;
    }
    if (bio.length > 150) {
      setError("Bio description exceeds the 150-character limit");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      // NOTE - For Backend Integration:
      // When connecting to your backend server, instead of passing the mock profilePic string:
      // 1. Create a FormData instance: const formData = new FormData();
      // 2. Append values:
      //    if (selectedFile) formData.append('profilePic', selectedFile);
      //    formData.append('bio', bio);
      //    formData.append('displayName', displayName);
      // 3. Dispatch to API endpoint: await axios.patch('/api/users/profile', formData);
      if (selectedFile) {
        console.log("Selected local profile photo for backend upload:", selectedFile);
      }
      await updateProfile(bio.trim(), displayName.trim(), selectedFile);
    } catch {
      setError("Failed to update profile settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-black font-sans relative">
      {/* Header */}
      <div className="h-14 border-b border-neutral-900 px-4 flex items-center justify-between shrink-0 bg-neutral-950/70 backdrop-blur-md absolute top-0 left-0 right-0 z-30 select-none">
        <button 
          onClick={() => setActivePage("profile")}
          className="p-1.5 text-neutral-300 hover:text-white transition-colors rounded-xl hover:bg-neutral-900"
          title="Back to Profile"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h1 className="text-sm font-bold text-white tracking-wide">
          Setting Page
        </h1>

        <button 
          onClick={() => setShowNotifications(true)}
          className="p-1.5 text-neutral-300 hover:text-white transition-colors rounded-xl hover:bg-neutral-900"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Form Container */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-neutral-800 pb-24 pt-18 h-full">
        <div className="bg-[#121212] rounded-2xl border border-neutral-900/60 p-4 shadow-xl">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar Edit Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group cursor-pointer">
                <input 
                  type="file" 
                  id="profile-pic-upload" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <label htmlFor="profile-pic-upload" className="cursor-pointer block relative">
                  <img 
                    src={profilePic} 
                    alt="Profile Pic" 
                    className="w-20 h-20 rounded-full object-cover border border-neutral-800 transition-all group-hover:opacity-75"
                    onError={() => setProfilePic("https://ursmindfully.com/wp-content/uploads/2020/08/Profile-Icon-SVG-09856789.png")}
                  />
                  <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white animate-pulse" />
                  </div>
                </label>
              </div>


            </div>

            {/* Display Name Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 select-none pl-1">
                Display Name
              </label>
              <input 
                type="text"
                placeholder="Choose a display name..."
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setError("");
                }}
                maxLength="40"
                className="w-full bg-neutral-900/50 border border-neutral-800/80 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-rose-500/80 transition-colors placeholder-neutral-500 font-sans"
              />
            </div>

            {/* Bio Description Area */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 select-none pl-1 flex justify-between">
                <span>Bio Description</span>
                <span className={bio.length > 150 ? "text-rose-500" : "text-neutral-500"}>
                  {bio.length}/150
                </span>
              </label>
              
              <textarea 
                placeholder="Tell us about yourself..." 
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setError("");
                }}
                rows="3"
                maxLength="150"
                className="w-full bg-neutral-900/50 border border-neutral-800/80 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-rose-500/80 resize-none transition-colors placeholder-neutral-500 leading-relaxed font-sans"
              />
              {error && <span className="text-[10px] text-rose-500 font-semibold pl-1">{error}</span>}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSaving || bio.length > 150}
              className="w-full py-3 bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:from-neutral-900 disabled:to-neutral-900 disabled:text-neutral-600 text-xs font-bold rounded-xl text-white shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
