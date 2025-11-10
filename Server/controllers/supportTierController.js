import SupportTier from '../model/SupportTier.js';

export const createSupportTier = async (req, res) => {
  const { project_id, title, description, amount, limit } = req.body;
  try {
    const tier = await SupportTier.create({ project_id, title, description, amount, limit });
    res.status(201).json({ error: false, message: "Support tier created successfully", tier });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const getSupportTiersByProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const tiers = await SupportTier.find({ project_id: projectId });
    res.status(200).json({ error: false, message: "Support tiers retrieved successfully", tiers });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
