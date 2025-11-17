import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  const mockUsersRepository: jest.Mocked<UsersRepository> = {
    createAndSave: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByIdOrThrow: jest.fn(),
    findByEmail: jest.fn(),
    updatePartial: jest.fn(),
    removeById: jest.fn(),
  } as any;

  const mockUser: User = {
    id_usuario: '123e4567-e89b-12d3-a456-426614174000',
    cuit: '20123456789',
    name: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    email: 'john@email.com',
    phone: '3001234567',
    birthdate: new Date('1990-01-15'),
    credential: null,
    reviews: [],
    mythStories: [],
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createDto = {
        name: 'John',
        lastName: 'Doe',
        email: 'john@email.com',
        address: '123 Main St',
        birthdate: '1990-01-15',
      } as any;

      repository.findByEmail.mockResolvedValue(null as any);
      repository.createAndSave.mockResolvedValue(mockUser);

      const result = await service.create(createDto);

      expect(result).toEqual(mockUser);
      expect(repository.findByEmail).toHaveBeenCalledWith(createDto.email);
      expect(repository.createAndSave).toHaveBeenCalledWith(createDto);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createDto = {
        name: 'John',
        lastName: 'Doe',
        email: 'john@email.com',
        address: '123 Main St',
        birthdate: '1990-01-15',
      } as any;

      repository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      repository.findAll.mockResolvedValue(users as any);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      repository.findByIdOrThrow.mockResolvedValue(mockUser);

      const result = await service.findOne(mockUser.id_usuario);

      expect(result).toEqual(mockUser);
      expect(repository.findByIdOrThrow).toHaveBeenCalledWith(mockUser.id_usuario);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      repository.findByIdOrThrow.mockRejectedValue(new NotFoundException());

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateDto = { name: 'John Updated' } as any;
      const updatedUser = { ...mockUser, ...updateDto } as User;

      repository.findByIdOrThrow.mockResolvedValue(mockUser);
      repository.findByEmail.mockResolvedValue(null as any);
      repository.updatePartial.mockResolvedValue(updatedUser);

      const result = await service.update(mockUser.id_usuario, updateDto);

      expect(result).toEqual(updatedUser);
      expect(repository.updatePartial).toHaveBeenCalledWith(mockUser.id_usuario, updateDto);
    });

    it('should throw ConflictException if new email already exists', async () => {
      const updateDto = { email: 'other@email.com' } as any;

      repository.findByIdOrThrow.mockResolvedValue(mockUser);
      repository.findByEmail.mockResolvedValue({ ...mockUser, id_usuario: 'other-id' } as any);

      await expect(service.update(mockUser.id_usuario, updateDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      repository.removeById.mockResolvedValue();

      await service.remove(mockUser.id_usuario);

      expect(repository.removeById).toHaveBeenCalledWith(mockUser.id_usuario);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      repository.removeById.mockRejectedValue(new NotFoundException());

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
