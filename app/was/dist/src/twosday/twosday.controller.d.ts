import { TwosdayService } from './twosday.service';
export declare class TwosdayController {
    private readonly twosdayService;
    constructor(twosdayService: TwosdayService);
    hello(): {
        message: string;
    };
}
