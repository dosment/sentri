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

export async function login(input: LoginInput) {
  const dealer = await prisma.dealer.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      isAdmin: true,
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

  const { passwordHash: _, isAdmin, ...dealerData } = dealer;

  // Only include isAdmin in response if user is actually an admin
  // This prevents leaking role information to regular dealers
  if (isAdmin) {
    return { dealer: { ...dealerData, isAdmin: true as const }, token };
  }

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
      isAdmin: true,
      createdAt: true,
    },
  });

  if (!dealer) {
    throw new Error('Dealer not found');
  }

  // Only include isAdmin in response if user is actually an admin
  // This prevents leaking role information to regular dealers
  const { isAdmin, ...dealerData } = dealer;
  if (isAdmin) {
    return { ...dealerData, isAdmin: true as const };
  }

  return dealerData;
}

function generateToken(dealerId: string, email: string): string {
  return jwt.sign({ dealerId, email }, env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

export interface OnboardingStatus {
  steps: {
    id: string;
    label: string;
    completed: boolean;
  }[];
  completedCount: number;
  totalCount: number;
  isComplete: boolean;
}

export async function getOnboardingStatus(dealerId: string): Promise<OnboardingStatus> {
  const [platformConnection, reviewCount, approvedResponseCount] = await Promise.all([
    prisma.platformConnection.findFirst({
      where: { dealerId, platform: 'GOOGLE', isActive: true },
      select: { id: true },
    }),
    prisma.review.count({
      where: { dealerId },
    }),
    prisma.response.count({
      where: { dealerId, status: 'APPROVED' },
    }),
  ]);

  const steps = [
    {
      id: 'account_created',
      label: 'Create your account',
      completed: true, // Always true if they're authenticated
    },
    {
      id: 'google_connected',
      label: 'Connect Google Business Profile',
      completed: !!platformConnection,
    },
    {
      id: 'first_review',
      label: 'Receive your first review',
      completed: reviewCount > 0,
    },
    {
      id: 'first_response',
      label: 'Approve your first AI response',
      completed: approvedResponseCount > 0,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;

  return {
    steps,
    completedCount,
    totalCount: steps.length,
    isComplete: completedCount === steps.length,
  };
}
