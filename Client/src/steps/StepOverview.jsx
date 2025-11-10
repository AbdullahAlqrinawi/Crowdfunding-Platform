export default function StepOverview({ formData, handleChange }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-md">
        <label className="block mb-2 font-semibold">Project Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your project title"
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-md">
        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Briefly describe your project"
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-md">
        <label className="block mb-2 font-semibold">Project Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
        />
       {formData.image && (
  <div className="mt-2">
    <img src={URL.createObjectURL(formData.image)} alt="Project" className="w-32 h-32 object-cover rounded-md" />
    <p className="mt-2 text-sm text-green-400">Image selected: {formData.image.name}</p>
  </div>
)}

      </div>
    </div>
  );
}
