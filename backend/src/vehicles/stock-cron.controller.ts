import { Controller, Get, Header, Headers, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'node:crypto';
import { StockSyncService } from './stock-sync.service';

@Controller('cron')
export class StockCronController {
  constructor(private readonly sync: StockSyncService, private readonly config: ConfigService) {}

  @Get('sync-stock')
  @Header('Cache-Control', 'no-store')
  run(@Headers('authorization') authorization?: string) {
    const secret = this.config.get<string>('CRON_SECRET');
    if (!secret) throw new ServiceUnavailableException('CRON_SECRET não configurado.');
    const expected = Buffer.from(`Bearer ${secret}`);
    const received = Buffer.from(authorization || '');
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
      throw new UnauthorizedException();
    }
    // The scheduled job always uses the feed saved in the admin panel.
    return this.sync.run();
  }
}
