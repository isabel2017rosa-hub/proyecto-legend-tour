// src/users/users.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const RELATIONS = ['credential', 'reviews'] as const;

type PageOpts = { skip?: number; take?: number };

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async createAndSave(dto: CreateUserDto): Promise<User> {
    const entity: Partial<User> = {
      name: dto.name,
      lastName: dto.lastName,
      email: dto.email,
      address: dto.address,
      birthdate: new Date(dto.birthdate),
      cuit: dto.cuit ?? null,
      phone: (dto as any).phone ?? null,
    };
    const user = this.repo.create(entity);
    return this.repo.save(user);
  }

  async findAll(opts?: PageOpts): Promise<User[]> {
    return this.repo.find({
      relations: RELATIONS as unknown as string[],
      skip: opts?.skip,
      take: opts?.take,
      order: { name: 'ASC', lastName: 'ASC' },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id_usuario: id }, relations: RELATIONS as unknown as string[] });
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async updatePartial(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findByIdOrThrow(id);
    const partial: any = { ...dto };
    if (partial.birthdate) {
      // Accept string or Date
      partial.birthdate = new Date(partial.birthdate as any);
    }
    Object.assign(user, partial);
    return this.repo.save(user);
  }

  async removeById(id: string): Promise<void> {
    const user = await this.findByIdOrThrow(id);
    await this.repo.remove(user);
  }
}
