import Group from '../../backend/models/group.model.js';

export const getGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch groups' });
    }
};