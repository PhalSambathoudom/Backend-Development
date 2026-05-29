import {
    createUser as createUserModel,
    deleteUser as deleteUserModel,
    getUserById as getUserByIdModel,
    getUsers as getUsersModel,
    updateUser as updateUserModel
} from '../models/userModel.js';

export const getAllUsers = () => getUsersModel();
export const getUserById = (id) => getUserByIdModel(id);
export const createUser = (payload) => createUserModel(payload);
export const updateUser = (id, updates) => updateUserModel(id, updates);
export const deleteUser = (id) => deleteUserModel(id);
