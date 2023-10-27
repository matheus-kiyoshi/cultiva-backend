import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaService],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(controller.findAll()).toBeInstanceOf(Array);
    });
  })

  describe('create', () => {
    it('should create a new user', async () => {
      expect(controller.create(JSON.parse(JSON.stringify({  
        name: 'name',
        email: 'email@example.com',
        password: 'password123'
      })))).toBeInstanceOf(Object);
    });
  })

  // describe('findById', () => {
  //   it('should return a user', async () => {
  //     expect(controller.findById('')).toBeInstanceOf(Object);
  //   });
  // })

  // describe('update', () => {
  //   it('should update a user', async () => {
  //     expect(controller.update('jwt token', JSON.parse(JSON.stringify({ 
  //       name: 'name',
  //       email: 'email@example.com',
  //       telephone: '+551123902-1293',
  //       address: {
  //         create: {
  //           street: 'street',
  //           number: 'number',
  //           complement: 'complement',
  //           city: 'city',
  //           cep: 'cep',
  //           state: 'state',
  //           country: 'country',
  //         }
  //       }
  //      })).toBeInstanceOf(Object);
  //   });  
  // })
});
