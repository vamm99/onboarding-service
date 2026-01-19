import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingService } from './onboarding.service';
import { OnboardingRepository } from './repositories/onboarding.repository';
import { EncryptionService } from '../../common/services/encryption.service';
import { Types } from 'mongoose';
import { RegisterOnboardingDto } from './dtos/register.dto';

describe('OnboardingService', () => {
  let service: OnboardingService;
  let repository: OnboardingRepository;
  let encryptionService: EncryptionService;

  // Mock del repository - simula las funciones de base de datos
  const mockOnboardingRepository = {
    getOnboardingByUserId: jest.fn(),
    create: jest.fn(),
    getAllOnboardingsByUserId: jest.fn(),
  };

  // Mock del servicio de encriptación
  const mockEncryptionService = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OnboardingService,
        {
          provide: OnboardingRepository,
          useValue: mockOnboardingRepository,
        },
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
      ],
    }).compile();

    service = module.get<OnboardingService>(OnboardingService);
    repository = module.get<OnboardingRepository>(OnboardingRepository);
    encryptionService = module.get<EncryptionService>(EncryptionService);

    // Limpiar los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(encryptionService).toBeDefined();
  });

  describe('registerOnboarding', () => {
    it('should register a new onboarding successfully', async () => {
      // 1. ARRANGE (Preparar) - Preparamos los datos de prueba
      const userId = '507f1f77bcf86cd799439011';
      const onboardingDto: RegisterOnboardingDto = {
        fullName: 'Juan Pérez',
        documentNumber: '12345678',
        email: 'juan@example.com',
        initialAmount: 1000,
      };

      const encryptedData = {
        fullName: 'encrypted_juan',
        documentNumber: 'encrypted_12345678',
        email: 'encrypted_juan@example.com',
        initialAmount: 1000,
      };

      const createdOnboarding = {
        _id: new Types.ObjectId(),
        userId,
        ...encryptedData,
        status: 'REQUESTED',
      };

      // 2. Configuramos los mocks - les decimos qué devolver
      mockOnboardingRepository.getOnboardingByUserId.mockResolvedValue(null); // No existe usuario previo
      mockEncryptionService.encrypt.mockImplementation(
        (value) => `encrypted_${value}`,
      ); // Simula encriptación
      mockOnboardingRepository.create.mockResolvedValue(createdOnboarding); // Simula creación en DB

      // 3. ACT (Actuar) - Ejecutamos el método que queremos probar
      const result = await service.registerOnboarding(userId, onboardingDto);

      // 4. ASSERT (Afirmar) - Verificamos que todo funcionó como esperábamos
      expect(
        mockOnboardingRepository.getOnboardingByUserId,
      ).toHaveBeenCalledWith(userId);
      expect(
        mockOnboardingRepository.getOnboardingByUserId,
      ).toHaveBeenCalledTimes(1);

      expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('Juan Pérez');
      expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('12345678');
      expect(mockEncryptionService.encrypt).toHaveBeenCalledWith(
        'juan@example.com',
      );
      expect(mockEncryptionService.encrypt).toHaveBeenCalledTimes(3);

      expect(mockOnboardingRepository.create).toHaveBeenCalledWith(userId, {
        fullName: 'encrypted_Juan Pérez',
        documentNumber: 'encrypted_12345678',
        email: 'encrypted_juan@example.com',
        initialAmount: 1000,
      });

      expect(result).toEqual({
        onboardingId: createdOnboarding._id,
        status: 'REQUESTED',
      });
    });
  });
});
