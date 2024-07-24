import { Test, TestingModule } from '@nestjs/testing';
import { TwosdayReferenceController } from './reference.controller';
import { TwosdayReferenceService } from './reference.service';

describe('ReferenceController', () => {
  let controller: TwosdayReferenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwosdayReferenceController],
      providers: [TwosdayReferenceService],
    }).compile();

    controller = module.get<TwosdayReferenceController>(
      TwosdayReferenceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
