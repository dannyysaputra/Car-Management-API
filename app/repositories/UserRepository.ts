import { UserModel, UserType } from '../models/UserModel';
import { Transaction } from 'objection';

export class UserRepository {
  // Find a user by email
    public async findByEmail(email: string): Promise<UserType | undefined> {
        return await UserModel.query().findOne({ email });
    }

    // Find a user by ID
    public async findById(id: string): Promise<UserType | undefined> {
        return await UserModel.query().findById(id);
    }

    // Insert a new user
    public async createUser(user: Partial<UserType>): Promise<UserType> {
        return await UserModel.query().insert(user);
    }

    // Update a user by ID
    public async updateUser(id: string, user: Partial<UserType>): Promise<UserType> {
        return await UserModel.query().patchAndFetchById(id, user);
    }

    // Delete a user by ID
    public async deleteUser(id: string): Promise<number> {
        return await UserModel.query().deleteById(id);
    }
}
