import { UserRepository } from '../repositories/UserRepository';
import { UserType } from '../models/UserModel';
import { encryptPassword, checkPassword, createToken } from '../utils/encrypt';// Adjust the import based on your project structure

export class UserService {
    private userRepository: UserRepository;
  
    constructor() {
      this.userRepository = new UserRepository();
    }
  
    public async registerUser(userData: Partial<UserType>): Promise<UserType> {
      userData.password = await encryptPassword(userData.password as string);
      return this.userRepository.createUser(userData);
    }
  
    public async createAdminUser(userData: Partial<UserType>, createdBy: string): Promise<UserType> {
      userData.password = await encryptPassword(userData.password as string);
      userData.role = 'admin';
      userData.created_by = createdBy;
      return this.userRepository.createUser(userData);
    }
  
    public async findUserByEmail(email: string): Promise<UserType | undefined> {
      return this.userRepository.findByEmail(email);
    }
  
    public async findUserById(id: string): Promise<UserType | undefined> {
      return this.userRepository.findById(id);
    }
  
    public async verifyPassword(storedPassword: string, providedPassword: string): Promise<boolean> {
      return await checkPassword(storedPassword, providedPassword);
    }
  
    public async generateToken(user: UserType): Promise<string> {
      return await createToken({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      });
    }
  }
