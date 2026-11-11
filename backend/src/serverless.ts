import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { AppModule } from './app.module';

let application: Promise<ReturnType<typeof express>> | undefined;

async function createApplication() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), { abortOnError: false });
  app.setGlobalPrefix('api');
  await app.init();
  return server;
}

export async function handler(req: IncomingMessage, res: ServerResponse) {
  // Share initialization between concurrent invocations; retry if startup fails.
  application ??= createApplication().catch((error) => {
    application = undefined;
    throw error;
  });
  const server = await application;
  server(req, res);
}
