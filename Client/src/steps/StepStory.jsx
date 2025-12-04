import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function StepStory({ formData, handleChange, setFormData }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // دالة جديدة لإزالة علامات Markdown
  const cleanMarkdownText = (text) => {
    if (!text) return "";
    
    return text
      // إزالة العناوين (مثل #، ##، ###)
      .replace(/#{1,6}\s?/g, '')
      // إزالة النص العريض (**نص** أو __نص__)
      .replace(/\*\*(.*?)\*\*|__(.*?)__/g, '$1$2')
      // إزالة النص المائل (*نص* أو _نص_)
      .replace(/\*(.*?)\*|_(.*?)_/g, '$1$2')
      // إزالة الخط المتوسط (~~نص~~)
      .replace(/~~(.*?)~~/g, '$1')
      // إزالة الروابط ([نص](رابط))
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      // إزالة الصور (![alt](رابط))
      .replace(/!\[(.*?)\]\(.*?\)/g, '$1')
      // إزالة القوائم (-، *، +)
      .replace(/^[\s]*[-*+]\s/gm, '')
      // إزالة الأرقام في القوائم (1.، 2.، إلخ)
      .replace(/^[\s]*\d+\.\s/gm, '')
      // تنظيف المسافات الزائدة
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  };

  const handleGenerateStory = async () => {
    if (!formData.title || !formData.description || !formData.target) {
      toast.error("Please fill in all fields first.");
      return;
    }

const prompt = `Write an inspiring and engaging crowdfunding project story in English based on these details:
Title: ${formData.title}
Description: ${formData.description}

Focus on:
- The project's background and mission
- Why this project matters and its significance
- The positive impact it will have on the community
- The journey and vision behind the project
- A call to action to support the mission (not focusing on the money)

Write in a professional, emotional, and motivating tone, making the reader feel connected to the project's story.`;


    try {
      setLoading(true);
      setProgress(0);
      
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await axios.post(
        "http://localhost:5000/api/ai/generate-story", 
        { prompt },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(Math.min(percentCompleted, 90));
            }
          }
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (response.data.error) {
        throw new Error(response.data.message);
      }

      // تنظيف النص من علامات Markdown قبل حفظه
      const cleanedStory = cleanMarkdownText(response.data.message);
      setFormData({ ...formData, story: cleanedStory });
      toast.success("Story generated successfully!");
      
      setTimeout(() => {
        setProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error("Generation Error:", error);
      setProgress(0);
      
      if (error.response?.status === 404) {
        toast.error("AI model not available. Using fallback story...");
        handleGenerationError();
      } else if (error.response?.status === 403) {
        toast.error("AI service authorization failed. Using fallback story...");
        handleGenerationError();
      } else if (error.response?.status === 429) {
        toast.error("AI service busy. Please try again in a moment.");
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        toast.error("Cannot connect to server. Please check if backend is running.");
      } else if (error.response?.status === 500) {
        toast.error("AI service error. Using fallback story...");
        handleGenerationError();
      } else {
        toast.error(error.response?.data?.message || "Failed to generate story. Using fallback...");
        handleGenerationError();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerationError = () => {
    const fallbackStory = createFallbackStory();
    // تنظيف النص الاحتياطي أيضاً
    const cleanedFallbackStory = cleanMarkdownText(fallbackStory);
    setFormData({ ...formData, story: cleanedFallbackStory });
  };

  const createFallbackStory = () => {
    return `${formData.title || "Our Project"}

Our Mission
${formData.description || "We are working on an important project that needs your support."}

The Story Behind Our Project
We believe that every great change starts with a simple idea and the courage to pursue it. Our journey began when we recognized a need in our community - a gap that we knew we could fill with passion, dedication, and your support.

Why This Matters
This project represents more than just a goal; it's a commitment to making a tangible difference. We've seen firsthand the challenges and opportunities, and we're convinced that with the right resources, we can create lasting positive impact.

How Your Support Helps
We are seeking to raise $${formData.target || "our target"} to bring this vision to life. Your contributions will be strategically allocated to ensure maximum impact:

Core Development (40%): Turning our vision into actionable reality
Essential Resources (30%): Acquiring the tools and materials we need
Expert Execution (20%): Bringing together the right talent and expertise
Community Engagement (10%): Ensuring our solution reaches those who need it most

The Impact You'll Create
Every contribution moves us closer to our goal. You're not just funding a project - you're investing in innovation, community development, and creating a blueprint for future initiatives.

Join Our Movement
We invite you to be part of something bigger than all of us. Together, we can transform challenges into opportunities and ideas into reality.

Thank you for considering supporting our mission. Your belief in what we're building gives us the strength to push forward and make a real difference.`;
};

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-md">
      <label className="block mb-2 font-semibold">Project Story</label>
      
      <textarea
        name="story"
        value={formData.story}
        onChange={handleChange}
        rows={8}
        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={
          loading
            ? "Generating your story with AI... please wait ⏳"
            : "Tell your project's story to inspire backers, or use the button below to generate it automatically"
        }
        disabled={loading}
      />

      {loading && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-300 mb-1">
            <span>Generating your story...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-3">
        <button
          type="button"
          onClick={handleGenerateStory}
          disabled={loading || !formData.title || !formData.description || !formData.target}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating... {progress}%
            </>
          ) : (
            "Generate Story with AI"
          )}
        </button>
        
        {(!formData.title || !formData.description || !formData.target) && (
          <span className="text-yellow-400 text-sm text-center">
            ⚠️ Please fill in the title, description, and target amount first
          </span>
        )}
        
        <div className="text-xs text-gray-400 text-center">
          If AI services are unavailable, a professional fallback story will be generated automatically
        </div>
      </div>
    </div>
  );
}