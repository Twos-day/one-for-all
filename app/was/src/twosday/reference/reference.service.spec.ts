import { Test, TestingModule } from '@nestjs/testing';
import { TwosdayReferenceService } from './reference.service';

describe('ReferenceService', () => {
  let service: TwosdayReferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwosdayReferenceService],
    }).compile();

    service = module.get<TwosdayReferenceService>(TwosdayReferenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
