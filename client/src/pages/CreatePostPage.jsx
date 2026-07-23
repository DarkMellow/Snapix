import { useState } from "react";
import { useApp } from "../context/AppContext";
import { ChevronLeft, Bell, Image as ImageIcon, Send } from "lucide-react";

export default function CreatePostPage() {
  const { createPost, setActivePage, setShowNotifications } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Generate temporary preview URL for front-end mockup representation
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError("Please choose a local photo to post");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    try {
      // NOTE - For Backend Integration:
      // When connecting to your backend server, instead of passing the mock imageUrl string:
      // 1. Create a FormData instance: const formData = new FormData();
      // 2. Append values: 
      //    if (selectedFile) formData.append('image', selectedFile); 
      //    formData.append('caption', caption);
      // 3. Dispatch to API endpoint: await axios.post('/api/posts/create', formData);
      if (selectedFile) {
        console.log("Selected local file for backend upload:", selectedFile);
      }
      await createPost(caption.trim(), selectedFile);
    } catch {
      setError("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-black font-sans relative">
      {/* Header */}
      <div className="h-14 border-b border-neutral-900 px-4 flex items-center justify-between shrink-0 bg-neutral-950/70 backdrop-blur-md absolute top-0 left-0 right-0 z-30">
        <button 
          onClick={() => setActivePage("feed")}
          className="p-1.5 text-neutral-300 hover:text-white transition-colors rounded-xl hover:bg-neutral-900"
          title="Back to Feed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h1 className="text-sm font-bold text-white tracking-wide select-none">
          Create Post
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
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Selection Area */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 select-none">
                Image Selection
              </label>
              
              {imageUrl ? (
                <div className="relative w-full aspect-square bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 shadow-inner group">
                  <img 
                    src={imageUrl} 
                    alt="Post preview" 
                    className="w-full h-full object-cover" 
                    onError={() => setError("Invalid image URL. Unable to load image preview.")}
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      setImageUrl("");
                      setSelectedFile(null);
                    }}
                    className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full text-xs font-bold transition-colors shadow-md backdrop-blur-sm"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  <input 
                    type="file" 
                    id="post-file-upload" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                  <label 
                    htmlFor="post-file-upload" 
                    className="w-full aspect-square rounded-xl border-2 border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-950/30 hover:bg-neutral-900/40 flex flex-col items-center justify-center text-center p-6 transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-rose-500 transition-colors shadow-md">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-bold text-white mt-4">Upload a Snapshot Image</h3>
                    <p className="text-[10px] text-neutral-500 mt-1 max-w-[200px]">Click this area to choose an image file from your device storage</p>
                  </label>
                </>
              )}
            </div>

            {/* Error Message Panel */}
            {error && (
              <div className="text-[10px] text-rose-500 font-semibold pl-1 select-none">
                {error}
              </div>
            )}



            {/* Caption Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 select-none">
                Caption
              </label>
              <textarea 
                placeholder="Write a descriptive caption for your snap..." 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows="3"
                className="w-full bg-neutral-900/50 border border-neutral-800/80 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-rose-500/80 resize-none transition-colors placeholder-neutral-500 leading-relaxed font-sans"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting || !imageUrl.trim()}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:from-neutral-900 disabled:to-neutral-900 disabled:text-neutral-600 text-xs font-bold rounded-xl text-white shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Snapshot...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Post Image</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
