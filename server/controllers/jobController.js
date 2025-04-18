import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';
import Job from '../models/JobModel.js'; 
// Assuming you have a Job model

export const createJob = asyncHandler(async (req, res) => { 
    try {
        const user = await User.findOne({ auth0Id: req.oidc.user.sub });

        const isAuth = req.oidc.isAuthenticated() || user.email;

        if (!isAuth) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // console.log("User from DB:", req.body.title);
        const {title, description, location, tags, skills, salaryType, salary, jobType} = req.body;

        if(!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        if(!description) {
            return res.status(400).json({ message: "Description is required" });
        }
        if(!location) {
            return res.status(400).json({ message: "Location is required" });
        }   
        if(!tags) {
            return res.status(400).json({ message: "Tags are required" });
        }
        if(!skills) {
            return res.status(400).json({ message: "Skills are required" });
        }
        // if(!salaryType) {
        //     return res.status(400).json({ message: "Salary type is required" });
        // }
        if(!salary) {
            return res.status(400).json({ message: "Salary is required" });
        }
        if(!jobType) {
            return res.status(400).json({ message: "Job type is required" });
        }

        const job = new Job({
            title,
            description,
            location,
            tags,
            skills,
            // salaryType,
            salary,
            jobType,
            createdBy: user._id, // Assuming you want to associate the job with the user who created it
        });

        await job.save();

        return res.status(201).json({ message: "Job created successfully", job });
    }
    catch (error) {
        console.error("Error creating job:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//get jobs
export const getJobs = asyncHandler(async (req, res) => {
    try{
        const jobs = await Job.find({}).populate('createdBy', 'name email profilePicture').sort({createdAt: -1}); //sort by latest jobs // Assuming you want to populate the createdBy field with user details

        return res.status(200).json(jobs);
        // console.log("Jobs from DB:", jobs);
        if(!jobs) {
            return res.status(404).json({ message: "No jobs found" });
        }
    } catch(error) {
        console.error("Error getting jobs:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//get job by user
export const getJobsByUser = asyncHandler(async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        const jobs = await Job.find({ createdBy: user._id }).populate('createdBy', 'name email profilePicture').sort({createdAt: -1}); // Assuming you want to populate the createdBy field with user details

        return res.status(200).json(jobs);
    } catch(error){
        console.error("Error getting jobs by user:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//search jobs
export const searchJobs = asyncHandler(async (req, res) => {
    try{
        const { title, location, tags } = req.query; // Extract search parameters from query string

        const query = {};

        if(tags){
            query.tags = { $in: tags.split(",")}; // Case-insensitive search for tags
        }

        if(title){
            query.title = { $regex: title, $options: 'i' }; // Case-insensitive search for title}
        }

        if(location){
            query.location = { $regex: location, $options: 'i' }; // Case-insensitive search for location
        }
        
        const jobs = await Job.find(query).populate('createdBy', 'name profilePicture').sort({createdAt: -1}); // Assuming you want to populate the createdBy field with user details

        return res.status(200).json(jobs);
    } catch(error){
        console.error("Error searching jobs:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//apply for job
export const applyJob = asyncHandler(async (req, res) => {
    try{
        const job = await Job.findById(req.params.id);

        if(!job){
            return res.status(404).json({ message: "Job not found" });
        }

        const user = await User.findOne({ auth0Id: req.oidc.user.sub });

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user has already applied for the job
        if(job.applications.includes(user._id)){
            return res.status(400).json({ message: "You have already applied for this job" });
        }
        
        // Add the user to the job's applications array
        job.applications.push(user._id);
        await job.save();

        return res.status(200).json({ message: "Applied for job successfully", job });
    } catch (error){
        console.error("Error applying for job:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});


//like or unlike job

export const likeJob = asyncHandler(async (req, res) => {
    try{
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const user = await User.findOne({ auth0Id: req.oidc.user.sub });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if the user has already liked the job
        const isLiked = job.likes.includes(user._id);

        if (isLiked) {
            // Unlike the job
            job.likes = job.likes.filter((like) => !like.equals(user._id));
        } else {
            // Like the job
            job.likes.push(user._id);
        }
        
        await job.save();

        return res.status(200).json({ message: isLiked ? "Job unliked successfully" : "Job liked successfully", job });

    } catch(error){
            console.error("Error liking job:", error.message);
            return res.status(500).json({ message: "Internal server error" });
    }
});

//get job by id
export const getJobById = asyncHandler(async (req, res) => {
    try{
        const { id } = req.params; // Extract job ID from request parameters

        const job = await Job.findById(id).populate('createdBy', 'name profilePicture'); // Assuming you want to populate the createdBy field with user details
        
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        return res.status(200).json(job);
    } catch (error){
        console.error("Error getting job by ID:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//delete job

export const deleteJob = asyncHandler(async (req, res) => {
    try{
        const {id} = req.params; // Extract job ID from request parameters

        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        const user = await User.findOne({ auth0Id: req.oidc.user.sub });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is the creator of the job
        if (!job.createdBy.equals(user._id)) {
            return res.status(403).json({ message: "You are not authorized to delete this job" });
        }

        // await job.remove(); // Delete the job from the database

        await job.deleteOne({
            _id: id,
    
        }); // Delete the job from the database


        // await job.deleteOne({
        //     _id: id
        // }, (err, result) => {
        //     if (err) {
        //         console.error("Error deleting job:", err.message);
        //         return res.status(500).json({ message: "Internal server error" });
        //     }
        //     if (!result) {
        //         return res.status(404).json({ message: "Job not found" });
        //     }
        // }); // Delete the job from the database

        return res.status(200).json({ message: "Job deleted successfully" });

    }catch(error) {
        console.error("Error deleting job:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
})

