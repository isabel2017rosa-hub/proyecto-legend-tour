import { Injectable, ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

type PageOpts = { skip?: number; take?: number };

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  private normalizePage(opts?: { skip?: any; take?: any }): PageOpts | undefined {
    if (!opts) return undefined;
    const skip = opts.skip !== undefined ? Number(opts.skip) : undefined;
    const take = opts.take !== undefined ? Number(opts.take) : undefined;
    const norm: PageOpts = {};
    if (!Number.isNaN(skip!) && skip! >= 0) norm.skip = Math.floor(skip!);
    if (!Number.isNaN(take!) && take! > 0) norm.take = Math.min(Math.floor(take!), 100);
    return norm;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.repository.findByEmail(dto.email);
    if (existing) throw new ConflictException(`Email ${dto.email} already exists`);
    return this.repository.createAndSave(dto);
  }

  async findAll(opts?: { skip?: any; take?: any }): Promise<User[]> {
    return this.repository.findAll(this.normalizePage(opts));
  }

  async findOne(id: string): Promise<User> {
    return this.repository.findByIdOrThrow(id);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const current = await this.repository.findByIdOrThrow(id);
    if (dto.email && dto.email !== current.email) {
      const emailExists = await this.repository.findByEmail(dto.email);
      if (emailExists && emailExists.id_usuario !== id) {
        throw new ConflictException(`Email ${dto.email} already exists`);
      }
    }
    return this.repository.updatePartial(id, dto);
  }

  async remove(id: string): Promise<void> {
    return this.repository.removeById(id);
  }
}
