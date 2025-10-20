import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto } from './dto/auth-response.dto';

// In-memory OTP storage interface
interface OtpData {
  otp: string;
  hashedPassword: string;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  // In-memory cache for OTP codes
  private otpCache = new Map<string, OtpData>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {
    // Clean up expired OTPs every 5 minutes
    setInterval(() => {
      this.cleanupExpiredOtps();
    }, 5 * 60 * 1000);
  }

  // Clean up expired OTP codes from cache
  private cleanupExpiredOtps() {
    const now = new Date();
    for (const [email, data] of this.otpCache.entries()) {
      if (now > data.expiresAt) {
        this.otpCache.delete(email);
      }
    }
  }

  async sendOtp(sendOtpDto: SendOtpDto): Promise<{ message: string }> {
    const { email, password } = sendOtpDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set expiration (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Store OTP in memory cache
    this.otpCache.set(email, {
      otp,
      hashedPassword,
      expiresAt,
    });

    // Send OTP via email
    try {
      await this.mailService.sendOTP(email, otp);
    } catch (error) {
      console.error('Failed to send email:', error);
      // Remove from cache if email fails
      this.otpCache.delete(email);
      throw new BadRequestException('Failed to send OTP email. Please check your email address.');
    }

    return { message: 'OTP sent successfully to your email' };
  }

  async verifyOtpAndRegister(verifyOtpDto: VerifyOtpDto): Promise<AuthResponseDto> {
    const { email, otp } = verifyOtpDto;

    // Get OTP data from cache
    const otpData = this.otpCache.get(email);

    if (!otpData) {
      throw new NotFoundException('OTP not found or expired. Please request a new one.');
    }

    // Check if OTP is expired
    if (new Date() > otpData.expiresAt) {
      this.otpCache.delete(email);
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      throw new BadRequestException('Invalid OTP code');
    }

    // Create user with the hashed password
    const createUserDto: CreateUserDto = {
      email: email,
      password: otpData.hashedPassword, // Already hashed
    };

    const user = await this.usersService.createWithHashedPassword(createUserDto);

    // Delete OTP from cache after successful registration
    this.otpCache.delete(email);

    // Send welcome email
    try {
      await this.mailService.sendWelcomeEmail(email);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    // Generate tokens
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.usersService.create(createUserDto);
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<any> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  private async getTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
