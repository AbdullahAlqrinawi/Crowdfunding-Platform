export default function StepFunding({ formData, handleChange }) {
  const today = new Date().toISOString().split("T")[0]; 

  return (
    <div className="space-y-6">
      <div className="bg-primary p-6 rounded-2xl shadow-md">
        <label className="block mb-2 font-semibold">Funding Target (ETH)</label>
        <input
          type="number"
          name="target"
          value={formData.target}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount in ETH"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-md">
          <label className="block mb-2 font-semibold">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            min={today}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
          />
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-md">
          <label className="block mb-2 font-semibold">End Date</label>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={(e) => {
            if (e.target.value < formData.start_date) {
              toast.error('End date cannot be before start date.');
              return;
            }
            handleChange(e);
          }}
          min={formData.start_date || today}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
        />
         </div>
         
      </div>
    </div>
  );
}
