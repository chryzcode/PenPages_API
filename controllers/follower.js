import follower from "../models/follower";

export const followUnfollowUser = async (req, res) => {
    const userId = req.user.userId
    const { authorId } = req.params
    const user = 
}