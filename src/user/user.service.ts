import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  logger = new Logger('UserService');
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async create(createUserDto: CreateUserDto) {
    const user: User | null = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const userEntity = {
      ...createUserDto,
      password: hashedPassword,
    };
    const newRegister = new this.userModel(userEntity);
    return newRegister.save();
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(idUser: string) {
    const user: User | undefined = await this.userModel.findOne({ idUser: idUser }).select('mfaSecret  ').exec();
    if (!user) {
      this.logger.warn(`User with ID ${idUser} not found`);
      throw new NotFoundException(`User with ID ${idUser} not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findById(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
  }

  async updateMfaSecret(idUser: string, secret: string): Promise<User> {
    const mfaSecret = this.userModel.findOneAndUpdate(
      { idUser },
      { mfaSecret: secret, isMfaEnabled: true },
      { new: true },
    );
    if (!mfaSecret) {
      this.logger.warn(`Complaint with ID ${idUser} not found`);
      throw new NotFoundException(`Complaint with ID ${idUser} not found`);
    }
    return mfaSecret;
  }

  async validateUserEmail(email: string): Promise<User | undefined> {
    const user: User | undefined = await this.userModel
      .findOne({ email: email })
      .select('idUser email password role')
      .exec();
    if (!user) {
      this.logger.warn(`Complaint with ID ${email} not found`);
      throw new NotFoundException(`Complaint with ID ${email} not found`);
    }
    return user;
  }
}
