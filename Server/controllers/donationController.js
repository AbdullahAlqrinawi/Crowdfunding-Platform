import Donation from '../model/Donation.js';
import Project from '../model/Project.js';
import mongoose from 'mongoose';


export const getProjectDonors = async (req, res) => {
  const { projectId } = req.params;

  try {
    const donations = await Donation.find({ project_id: projectId })
      .populate("donor_id", "username profile_pic email")
      .sort({ created_at: -1 });

    const donors = donations.map(donation => ({
      donor_id: donation.donor_id?._id,
      username: donation.donor_id?.username || "Anonymous",
      profile_pic: donation.donor_id?.profile_pic || null,
      amount: parseFloat(donation.amount.toString()),
      date: donation.created_at,
    }));

    res.status(200).json({
      error: false,
      message: "Project donors retrieved successfully",
      donors,
    });
  } catch (error) {
    console.error("Error in getProjectDonors:", error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export const createDonation = async (req, res) => {
  try {
    const { 
      amount, 
      donor_id, 
      project_id, 
      selected_reward,
      currency,
      transaction_hash,
      payment_address,
      network 
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(project_id)) {
      return res.status(400).json({ error: true, message: 'Invalid project_id' });
    }

    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({ error: true, message: 'Project not found' });
    }

    const donation = new Donation({
      amount,
      donor_address: payment_address || donor_id, // دائماً نخزن عنوان المحفظة هنا
      donor_id: mongoose.Types.ObjectId.isValid(donor_id) ? donor_id : undefined, // فقط إذا كان ObjectId حقيقي
      project_id,
      selected_reward,
      currency: currency || 'ETH',
      transaction_hash: transaction_hash || '',
      payment_address: payment_address || '',
      network: network || 'Ethereum',
      created_at: new Date()
    });

    await donation.save();

    res.status(201).json({
      error: false,
      message: 'Donation created successfully',
      donation
    });
  } catch (error) {
    console.error('❌ Donation creation error:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};


export const getDonationsByProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const donations = await Donation.find({ project_id: projectId });
    res.status(200).json({
      error: false,
      message: 'Project donations retrieved successfully',
      donations
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

export const getDonationsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const donations = await Donation.find({ donor_id: userId });
    res.status(200).json({
      error: false,
      message: 'User donations retrieved successfully',
      donations
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

export const getUserDonations = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const donations = await Donation.find({ donor_id: userId })
      .populate({
        path: 'project_id',
        select: 'title image description owner_id',
        populate: {
          path: 'owner_id',
          select: 'username profile_pic'
        }
      })
      .sort({ date: -1 });

    const formattedDonations = donations.map(donation => ({
      id: donation._id,
      amount: parseFloat(donation.amount.toString()),
      currency: donation.currency,
      transaction_hash: donation.transaction_hash,
      payment_address: donation.payment_address,
      network: donation.network,
      date: donation.date,
      created_at: donation.date,
      project_id: donation.project_id ? {
        _id: donation.project_id._id,
        title: donation.project_id.title,
        image: donation.project_id.image,
        description: donation.project_id.description,
        owner_id: donation.project_id.owner_id
      } : null,
      selected_reward: donation.selected_reward
    }));

    res.status(200).json({
      error: false,
      message: "User donations retrieved successfully",
      donations: formattedDonations
    });
  } catch (error) {
    console.error('Error in getUserDonations:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

export const getUserDonatedProjects = async (req, res) => {
  const { userId } = req.params;
  try {
    const donations = await Donation.find({ donor_id: userId })
      .populate('project_id')
      .populate('donor_id', 'username profile_pic');

    const uniqueProjects = [];
    const seenProjects = new Set();
    
    donations.forEach(donation => {
      if (donation.project_id && !seenProjects.has(donation.project_id._id.toString())) {
        seenProjects.add(donation.project_id._id.toString());
        uniqueProjects.push(donation.project_id);
      }
    });

    res.status(200).json({
      error: false,
      message: "Funded projects retrieved successfully",
      projects: uniqueProjects
    });
  } catch (error) {
    console.error('Error in getUserDonatedProjects:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

export const getUserDonationsWithRewards = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const donations = await Donation.find({ donor_id: userId })
      .populate({
        path: 'project_id',
        select: 'title image rewards',
        populate: {
          path: 'owner_id',
          select: 'username profile_pic'
        }
      });
    
    const result = donations.map(donation => ({
      donation_id: donation._id,
      amount: donation.amount,
      date: donation.created_at,
      project: {
        id: donation.project_id._id,
        title: donation.project_id.title,
        image: donation.project_id.image,
        owner: donation.project_id.owner_id
      },
      selected_reward: donation.selected_reward 
        ? donation.project_id.rewards.id(donation.selected_reward)
        : null
    }));
    
    res.status(200).json({
      error: false,
      message: "User donations with rewards retrieved successfully",
      donations: result
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

export const getProjectDonationsWithRewards = async (req, res) => {
  const { projectId } = req.params;
  
  try {
    const donations = await Donation.find({ project_id: projectId })
      .populate({
        path: 'donor_id',
        select: 'username profile_pic email'
      });
    
    const project = await Project.findById(projectId).select('rewards');
    
    const result = donations.map(donation => ({
      donation_id: donation._id,
      amount: donation.amount,
      date: donation.created_at,
      donor: donation.donor_id,
      selected_reward: donation.selected_reward 
        ? project.rewards.id(donation.selected_reward)
        : null
    }));
    
    res.status(200).json({
      error: false,
      message: "Project donations with rewards retrieved successfully",
      donations: result
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};