import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getHello(): string {
    return 'Hello World!';
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  getDetailedHealth() {
    const dbState: number = this.connection.readyState;
    const isDbConnected: boolean = dbState === 1;

    return {
      status: isDbConnected ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      details: {
        database: {
          status: isDbConnected ? 'up' : 'down',
          readyState: dbState,
        },
        uptimeSeconds: Math.round(process.uptime()),
      },
    };
  }
}
