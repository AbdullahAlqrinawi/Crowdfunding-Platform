import Project from '../model/Project.js';
import { deleteFile } from '../utilities.js';


export const updateProject = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    target,
    end_date,
    story,
    location,
    categoryMain,
    categoryOptional
  } = req.body;
  
  const image = req.file ? req.file.path : null;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: true, message: "Project not found" });
    }

    if (project.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ 
        error: true, 
        message: "You can only update your own projects" 
      });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (target) project.target = target;
    if (end_date) project.end_date = end_date;
    if (story) project.story = story;
    if (location) project.location = location;
    if (categoryMain) project.main_category = categoryMain;
    if (categoryOptional) project.optional_category = categoryOptional;
    
    if (image) {
      if (project.image) {
        deleteFile(project.image);
      }
      project.image = image;
    }

    project.updated_at = Date.now();
    await project.save();

    res.status(200).json({ 
      error: false, 
      message: "Project updated successfully", 
      project 
    });
  } catch (error) {
    if (image) deleteFile(image);
    res.status(500).json({ error: true, message: error.message });
  }
};

export const createProject = async (req, res) => {
  const { title, description, target, start_date, end_date, rewards, story, location, categoryMain, categoryOptional, type, wallet_address } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const project = await Project.create({
      title,
      description,
      image,
      target,
      amount_raised: 0,
      owner_id:req.user.id,
      status: 'OPEN',
      start_date,
      end_date,
      rewards: JSON.parse(rewards), 
      story,
      location,
      main_category: categoryMain,
      optional_category: categoryOptional,
      project_type: type,
        wallet_address, 
    });

    res.status(201).json({ error: false, message: "Project created successfully", project });
  } catch (error) {
    if (image) deleteFile(image);
    res.status(500).json({ error: true, message: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ error: false, message: "Projects retrieved successfully", projects });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const updateAmountRaised = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  if (amount === undefined || isNaN(amount)) {
    return res.status(400).json({ message: "'amount' is required and must be a valid number" });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const amountToAdd = Number(amount);
    project.amount_raised = Number(project.amount_raised) + amountToAdd;

    await project.save();
    res.status(200).json({ message: "Updated", newAmount: project.amount_raised });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserProjects = async (req, res) => {
  const { userId } = req.params;
  try {
    const projects = await Project.find({ owner_id: userId });
    res.status(200).json({ error: false, message: "User projects retrieved successfully", projects });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id).populate('owner_id', 'username profile_pic _id');
    if (!project) return res.status(404).json({ error: true, message: "Project not found" });

    res.status(200).json({ error: false, message: "Project retrieved successfully", project });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

export const getProjectsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const projects = await Project.find({ owner_id: userId });
    res.status(200).json({ 
      error: false, 
      message: "User projects retrieved successfully", 
      projects 
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

