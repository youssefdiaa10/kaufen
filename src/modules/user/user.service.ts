import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import {
  UpdateCurrentPasswordDto,
  UpdateCurrentUserDto,
} from '../../dtos/user.dto.ts';
import { User } from '../../entities/user.entity.ts';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getCurrentUser(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('Account is not found!');

    return {
      user,
    };
  }

  async updateCurrentUser(
    id: string,
    updateCurrentUserDto: UpdateCurrentUserDto,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('Account is not found!');

    const updatedUser = Object.fromEntries(
      Object.entries(updateCurrentUserDto).filter(
        ([, value]) => value !== undefined,
      ),
    );

    this.userRepository.merge(user, updatedUser);

    await this.userRepository.save(user);

    return {
      message: 'Profile is updated successfully',
      user,
    };
  }

  async updateCurrentPassword(
    id: string,
    updateCurrentPasswordDto: UpdateCurrentPasswordDto,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('Account is not found!');

    const { currentPassword, oldPassword } = updateCurrentPasswordDto;

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) throw new ConflictException('Invalid password!');

    const currentHashPassword = await bcrypt.hash(currentPassword, 10);

    this.userRepository.merge(user, {
      password: currentHashPassword,
    });

    await this.userRepository.save(user);

    return {
      message: 'Password updated successfully',
    };
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('Account is not found!');

    await this.userRepository.delete(id);

    return {
      message: 'Account deleted successfully',
    };
  }
}
