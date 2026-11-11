import { ConflictException, Injectable, BadGatewayException, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VehiclesService } from './vehicles.service';
import { ConfigService } from '../admin/admin.service';

@Injectable()
export class StockSyncService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vehicles: VehiclesService,
    private readonly config: ConfigService,
  ) {}

  async run(url?: string, type?: string) {
    const config = url ? null : await this.config.getConfig();
    const targetUrl = url || config?.apiUrl;
    if (!targetUrl) throw new ServiceUnavailableException('Configure a URL do estoque no painel administrativo.');

    // Transaction-scoped lock works across Vercel instances and releases on failure.
    // All stock writes commit together, so failures cannot leave a partial import.
    return this.prisma.$transaction(async (tx) => {
      const [lock] = await tx.$queryRaw<{ locked: boolean }[]>`
        SELECT pg_try_advisory_xact_lock(21893721) AS locked
      `;
      if (!lock.locked) throw new ConflictException('Uma sincronização já está em andamento.');
      const result = await this.vehicles.processFromJson(targetUrl, type || config?.apiType || 'ALTIMUS', tx);
      if (!result.success) throw new BadGatewayException(result.message);
      return result;
    }, { maxWait: 5000, timeout: 260000 });
  }
}
