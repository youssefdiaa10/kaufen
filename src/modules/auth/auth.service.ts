import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import {
  RefreshDto,
  SignInDto,
  SignUpDto,
  VerifyDto,
} from '../../dtos/auth.dto.ts';
import { RefreshToken } from '../../entities/refresh-token.entity.ts';
import { User } from '../../entities/user.entity.ts';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { username, email, password } = signUpDto;

    const isFound = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (isFound) throw new ConflictException('Email is already exists');

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();

    const response = {
      message: 'Signed up successfully',
    };

    return response;
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) throw new NotFoundException('Email does not exist');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new ForbiddenException('Invalid password');

    const secretkey = this.configService.get<string>('JWT_SECRET');

    //! 1. Create access token
    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      secretkey!,
      { expiresIn: '1d' },
    );

    //! 2. Create empty RefreshToken record
    const refreshTokenEntity = this.refreshTokenRepository.create({
      token: '',
      user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    //! 3. Save it so TypeORM generates the UUID
    await this.refreshTokenRepository.save(refreshTokenEntity);

    //! 4. Create refresh JWT
    const refreshToken = jwt.sign(
      {
        sub: user.id,
        //! THIS is jti
        jti: refreshTokenEntity.id,
      },
      secretkey!,
      { expiresIn: '7d' },
    );

    //! 5. Hash refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    //! 6. Store hash
    refreshTokenEntity.token = hashedRefreshToken;
    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      message: 'Signed in successfully',
      accessToken,
      refreshToken,
    };
  }

  async verify(verifyDto: VerifyDto) {
    try {
      if (!verifyDto.token) throw new ForbiddenException('Ivalid Token');
      const secretkey = this.configService.get<string>('JWT_SECRET');
      const payload = jwt.verify(verifyDto.token, secretkey!) as {
        email: string;
      };
      const user = await this.userRepository.findOne({
        where: {
          email: payload.email,
        },
      });
      if (!user) throw new ForbiddenException('Verification Error');
      return {
        user,
        token: verifyDto.token,
      };
    } catch (error) {
      console.log(`Error: ${error}`);
      throw new ForbiddenException('Verification Error');
    }
  }

  async refresh(refreshDto: RefreshDto) {
    try {
      const { token } = refreshDto;
      const secretkey = this.configService.get<string>('JWT_SECRET');

      const payload = jwt.verify(token, secretkey!) as {
        sub: string;
        jti: string;
      };

      const refreshTokenEntity = await this.refreshTokenRepository.findOne({
        where: {
          id: payload.jti,
        },
        relations: {
          user: true,
        },
      });

      if (
        !refreshTokenEntity ||
        !refreshTokenEntity.token ||
        refreshTokenEntity.revoked ||
        refreshTokenEntity.user.id !== payload.sub ||
        refreshTokenEntity.expiresAt < new Date()
      ) {
        throw new ForbiddenException('Access denied');
      }

      const isMatch = await bcrypt.compare(token, refreshTokenEntity.token);
      if (!isMatch) throw new ForbiddenException('Access denied');

      const newAccessToken = jwt.sign(
        {
          sub: refreshTokenEntity.user.id,
          email: refreshTokenEntity.user.email,
        },
        secretkey!,
        { expiresIn: '1d' },
      );

      return {
        accessToken: newAccessToken,
      };
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
