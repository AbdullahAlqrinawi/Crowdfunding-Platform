import Like from '../model/Like.js';
import Project from '../model/Project.js';




export const checkUserLike = async (req, res) => {
  try {
    const { project_id } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ error: true, message: "Authentication required" });
    }

    const existingLike = await Like.findOne({ user_id, project_id });
    
    return res.status(200).json({
      error: false,
      liked: !!existingLike
    });
  } catch (error) {
    console.error("Check user like error:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
};


export const createLike = async (req, res) => {
  try {
    const { project_id } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ 
        error: true, 
        message: "Authentication required" 
      });
    }

    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({ 
        error: true, 
        message: "Project not found" 
      });
    }

    const existingLike = await Like.findOne({ user_id, project_id });
    if (existingLike) {
      return res.status(400).json({ 
        error: true, 
        message: "Project already liked" 
      });
    }

    const like = await Like.create({ user_id, project_id });
    
    res.status(201).json({ 
      error: false, 
      message: "Project liked successfully", 
      like 
    });
  } catch (error) {
    console.error('Create like error:', error);
    res.status(500).json({ 
      error: true, 
      message: "Internal server error" 
    });
  }
};

export const deleteLike = async (req, res) => {
  try {
    const { project_id } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ 
        error: true, 
        message: "Authentication required" 
      });
    }

    const like = await Like.findOneAndDelete({ user_id, project_id });
    if (!like) {
      return res.status(404).json({ 
        error: true, 
        message: "Like not found" 
      });
    }

    res.status(200).json({ 
      error: false, 
      message: "Project unliked successfully" 
    });
  } catch (error) {
    console.error('Delete like error:', error);
    res.status(500).json({ 
      error: true, 
      message: "Internal server error" 
    });
  }
};

export const getLikesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const likes = await Like.find({ project_id: projectId })
      .populate('user_id', 'username profile_pic');

    res.status(200).json({ 
      error: false, 
      message: "Likes retrieved successfully", 
      likes 
    });
  } catch (error) {
    console.error('Get likes by project error:', error);
    res.status(500).json({ 
      error: true, 
      message: "Internal server error" 
    });
  }
};

export const getUserLikedProjects = async (req, res) => {
  try {
    const { userId } = req.params;

    const tokenUserId = req.user?.id;
    if (!tokenUserId) {
      return res.status(401).json({ 
        error: true, 
        message: "Authentication required" 
      });
    }

    if (userId !== tokenUserId) {
      return res.status(403).json({ 
        error: true, 
        message: "You can only view your own likes" 
      });
    }

    const likes = await Like.find({ user_id: userId })
      .populate('project_id')
      .populate('user_id', 'username profile_pic');

    const projects = likes
      .map(like => like.project_id)
      .filter(project => project !== null);

    res.status(200).json({ 
      error: false, 
      message: "User liked projects retrieved successfully", 
      projects 
    });
  } catch (error) {
    console.error('Get user liked projects error:', error);
    res.status(500).json({ 
      error: true, 
      message: "Internal server error" 
    });
  }
};
