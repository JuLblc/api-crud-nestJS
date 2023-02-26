import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PassportModule } from '@nestjs/passport';
import * as session from 'express-session';
import * as passport from 'passport';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let cookie: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PassportModule.register({ session: true })],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 10 },
      }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  const productId = '000000652734';

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to this Technical test');
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer()).get('/users').expect(200);
  });

  it('/products/:id (GET) => User not signed it', () => {
    return request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(403);
  });

  it('/users (POST) => Validation', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'emailemail.com',
        password: 'Password!!1234',
      })
      .expect(400);
  });

  it('/users (POST) => Email adress already taken', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'email@email.com',
        password: 'Password!!1234',
      })
      .expect(409);
  });

  it('/auth/sessions (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/sessions')
      .send({
        email: 'email@email.com',
        password: 'Password!!1234',
      })
      .expect(201);

    cookie = response.header['set-cookie'][0];
    authToken = `Bearer ${cookie.split(';')[0]}`;

    expect(cookie).toBeDefined();
    expect(authToken).toBeDefined();
  });

  it.skip('/products/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/products/${productId}`)
      .set('Cookie', cookie)
      .set('Authorization', authToken)
      .expect(200);
  });

  it.skip('/users (PUT) => Update password', () => {
    return request(app.getHttpServer())
      .put('/users')
      .send({
        email: 'email@email.com',
        password: 'Password!!12345',
      })
      .expect(200);
  });
});
