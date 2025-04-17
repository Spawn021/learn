import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '@/modules/users/schemas/user.schema'
import { Model } from 'mongoose'
import aqp from 'api-query-params'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
