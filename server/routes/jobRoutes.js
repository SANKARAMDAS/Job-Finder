import express from 'express';
import { createJob, deleteJob, getJobs, getJobById, getJobsByUser, likeJob, searchJobs,applyJob } from '../controllers/jobController.js';
import protect  from '../middleware/protect.js';

const router = express.Router();

router.post("/jobs", protect, createJob);
router.get("/jobs", getJobs);
router.get("/jobs/user/:id", protect,getJobsByUser);

router.get("/jobs/search", searchJobs);
//apply jobs
router.put("/jobs/apply/:id", protect, applyJob);

//like or unlike jobs
router.put("/jobs/like/:id", protect, likeJob);

//get job by id
router.get("/jobs/:id", protect, getJobById);  

//delete job
router.delete("/jobs/:id", protect, deleteJob); 

export default router;