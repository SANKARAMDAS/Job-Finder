import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';

export const getUserProfile = asyncHandler(async (req, res) => {
    try{
        const { id } = req.params;

        //find user by auth0 id
        const user = await User.findOne({ auth0Id: id });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});