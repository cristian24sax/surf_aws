import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
// import * as request from 'supertest';
import request = require('supertest');
import { AppModule } from 'src/app.module';

describe('Subscriptions (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /subscriptions', async () => {
    const response = await request(app.getHttpServer())
      .post('/subscriptions')
      .send({
        studentId: '550e8400-e29b-41d4-a716-446655440000',
        plan: 'PREMIUM',
      })
      .expect(201);

    expect(response.body.studentId).toBe(
      '550e8400-e29b-41d4-a716-446655440000',
    );

    expect(response.body.plan).toBe('PREMIUM');
    expect(response.body.status).toBe('ACTIVE');
  });
});
