import Comment from '../model/Comment.js';
import Project from '../model/Project.js';

export const createComment = async (req, res) => {
  try {
    const { content, project_id, parent_id } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ error: true, message: "Authentication required" });
    }

    if (!content || !project_id) {
      return res.status(400).json({ error: true, message: "Content and project ID are required" });
    }

    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({ error: true, message: "Project not found" });
    }

    const comment = await Comment.create({
      content,
      user_id,
      project_id,
      parent_id: parent_id || null,
    });
    
    await comment.populate('user_id', 'username profile_pic');
    
    res.status(201).json({ error: false, message: "Comment created successfully", comment });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const getCommentsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const comments = await Comment.find({ project_id: projectId })
      .populate('user_id', 'username profile_pic')
      .sort({ createdAt: -1 });

    res.status(200).json({ error: false, message: "Comments retrieved", comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export default { createComment, getCommentsByProject };
