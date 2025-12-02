import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database.js';
import { env } from '../../config/env.js';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '24h';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  dealer: {
    id: string;
    email: string;
    name: string;
    plan: string;
  };
  token: string;
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existing = await prisma.dealer.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new Error('Email already registered');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const dealer = await prisma.dealer.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      phone: input.phone,
    },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
    },
  });

  const token = generateToken(dealer.id, dealer.email);

  return { dealer, token };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const dealer = await prisma.dealer.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      passwordHash: true,
    },
  });

  if (!dealer || !dealer.passwordHash) {
    throw new Error('Invalid credentials');
  }

  const valid = await bcrypt.compare(input.password, dealer.passwordHash);

  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(dealer.id, dealer.email);

  const { passwordHash: _, ...dealerData } = dealer;

  return { dealer: dealerData, token };
}

export async function getDealer(dealerId: string) {
  const dealer = await prisma.dealer.findUnique({
    where: { id: dealerId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      plan: true,
      autoApproveThreshold: true,
      createdAt: true,
    },
  });

  if (!dealer) {
    throw new Error('Dealer not found');
  }

  return dealer;
}

function generateToken(dealerId: string, email: string): string {
  return jwt.sign({ dealerId, email }, env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}
