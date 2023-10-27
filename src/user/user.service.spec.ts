import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaService],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      expect(service.create(JSON.parse(JSON.stringify({  
        name: 'name',
        email: 'email2@example.com',
        password: 'password123'
      })))).toBeInstanceOf(Object);
    })
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(service.findAll()).toBeInstanceOf(Array);
    })
  })

  // describe('findById', () => {
  //   it('should return a user', async () => {
  //     expect(service.findById('')).toBeInstanceOf(Object);
  //   })
  // })

  describe('findByEmail', () => {
    it('should return a user', async () => {
      expect(service.findByEmail('email2@example.com')).toBeInstanceOf(Object);
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      expect(service.update('jwt token', JSON.parse(JSON.stringify({ 
        name: 'name',
        email: 'email2@example.com',
        telephone: '+551123902-1293',
        address: {
          create: {
            street: 'street',
            number: 'number',
            complement: 'complement',
            city: 'city',
            cep: 'cep',
            state: 'state',
            country: 'country',
          }
        }
       })))).toBeInstanceOf(Object);
    })
  })

  // describe('remove', () => {
  //   it('should remove a user', async () => {
  //     expect(service.remove('id provided by jwt')).toBeInstanceOf(Object);
  //   })
  // })
});


