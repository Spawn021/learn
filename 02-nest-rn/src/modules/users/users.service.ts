import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '@/modules/users/schemas/user.schema'
import { Model } from 'mongoose'
import aqp from 'api-query-params'
import { CreateAuthDto } from '@/auth/dto/create-auth.dto'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  isEmailExist = async (email: string): Promise<boolean> => {
    const user = await this.userModel.findOne({ email })
    return !!user
  }
  async create(createUserDto: CreateUserDto) {
    try {
      const isEmailExist = await this.isEmailExist(createUserDto.email)
      if (isEmailExist) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Email already exists',
          },
          HttpStatus.BAD_REQUEST,
        )
      }
      const user = await this.userModel.create(createUserDto)
      return {
        statusCode: 201,
        message: 'User created successfully',
        data: user,
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'An error occurred while creating the user',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query)
    if (filter.current) delete filter.current
    if (filter.pageSize) delete filter.pageSize
    const page = current || 1
    const size = pageSize || 10
    const totalItems = await this.userModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / size)
    const skip = (page - 1) * size
    const users = await this.userModel
      .find(filter)
      .limit(size)
      .skip(skip)
      .sort(sort as any)
    return {
      data: { users },
      metadata: {
        totalItems,
        totalPages,
        current: page,
        pageSize: size,
      },
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email })
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto },
      { new: true },
    )
    return {
      statusCode: 200,
      message: 'User updated successfully',
      data: updateUser,
    }
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id)
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      )
    }

    return {
      statusCode: 200,
      message: 'User deleted successfully',
    }
  }
  async handleRegister(registerDto: CreateAuthDto) {
    const isEmailExist = await this.isEmailExist(registerDto.email)
    if (isEmailExist) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Email already exists',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    const codeId = uuidv4()
    const user = await this.userModel.create({
      ...registerDto,
      isActive: false,
      codeExpired: dayjs().add(30, 'second').toDate(),
      codeId: codeId,
    })
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account',
      template: 'register.hbs',
      context: {
        name: user.name ?? user.email,
        activationCode: codeId,
      },
    })

    return {
      statusCode: 201,
      message: 'User registered successfully',
      data: user,
    }
  }
}
