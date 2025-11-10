export default function StepDetails({ formData, handleChange }) {
    const filters = {
      location: ['Jordan', 'USA', 'UK', 'Germany', 'Canada', 'India', 'Australia', 'France'],
      category: ['Technology', 'Education', 'Healthcare', 'Finance', 'Art', 'Environment', 'Gaming', 'Fashion', 'Real Estate', 'Food'],
      type: ['Individual', 'Team', 'Organization', 'Non-profit', 'Commercial']
    };
  
    return (
      <div className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Location</label>
          <select name="location" value={formData.location} onChange={handleChange}
            className="w-full bg-gray-700 p-2 rounded-md text-white">
            <option value="">Select Location</option>
            {filters.location.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
  
        <div>
          <label className="block font-semibold mb-2">Main Category (Required)</label>
          <select name="categoryMain" value={formData.categoryMain} onChange={handleChange}
            className="w-full bg-gray-700 p-2 rounded-md text-white">
            <option value="">Select Main Category</option>
            {filters.category.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
  
        <div>
          <label className="block font-semibold mb-2">Optional Category</label>
          <select name="categoryOptional" value={formData.categoryOptional} onChange={handleChange}
            className="w-full bg-gray-700 p-2 rounded-md text-white">
            <option value="">Select Optional Category (Optional)</option>
            {filters.category.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
  
        <div>
          <label className="block font-semibold mb-2">Project Type</label>
          <select name="type" value={formData.type} onChange={handleChange}
            className="w-full bg-gray-700 p-2 rounded-md text-white">
            <option value="">Select Type</option>
            {filters.type.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </div>
    );
  }
  