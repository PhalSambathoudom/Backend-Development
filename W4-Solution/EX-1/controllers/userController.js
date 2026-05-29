import {
    createUser as createUserModel,
    deleteUser as deleteUserModel,
    getUserById as getUserByIdModel,
    getUsers as getUsersModel,
    updateUser as updateUserModel
} from '../models/userModel.js';

export const getAllUsers = (req, res) => {
    res.json(getUsersModel());
};

export const getUserById = (req, res) => {
    const id = Number(req.params.id);
    const user = getUserByIdModel(id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
};

export const createUser = (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    const newUser = createUserModel({ name, email });
    res.status(201).json(newUser);
};

export const updateUser = (req, res) => {
    const id = Number(req.params.id);
    const { name, email } = req.body;
    const user = updateUserModel(id, { name, email });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
};

export const deleteUser = (req, res) => {
    const id = Number(req.params.id);
    const deleted = deleteUserModel(id);
    if (!deleted) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
};
