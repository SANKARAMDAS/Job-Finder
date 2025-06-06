import mongoose, { sanitizeFilter } from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    // company: {
    //     type: String,
    //     required: true,
    // },
    location: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
        required: true,
    },
    salaryType: {
        type: String,
        default: "Per Annum",
    },
    negotiable: {
        type: Boolean,
        default: false,
    },
    jobType: [
        {
            type: String,
            required: true,
        }
    ],
    description: {
        type: String,
        required: true,
    },
    tags: [
        {
            type: String,
        }
    ],
    skills: [
        {
            type: String,
            required: true,
        }
    ],
    // companyLogo: {
    //     type: String,
    // },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
}, { timestamps: true });

const Job = mongoose.model('Job', JobSchema);

export default Job;