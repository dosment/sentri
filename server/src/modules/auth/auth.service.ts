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
  businessType?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  business: {
    id: string;
    email: string;
    name: string;
    plan: string;
    businessType: string;
  };
  token: string;
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existing = await prisma.business.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new Error('Email already registered');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const business = await prisma.business.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      phone: input.phone,
      businessType: (input.businessType as any) || 'OTHER',
    },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      businessType: true,
    },
  });

  const token = generateToken(business.id, business.email);

  return { business, token };
}

export async function login(input: LoginInput) {
  const business = await prisma.business.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      businessType: true,
      isAdmin: true,
      passwordHash: true,
    },
  });

  if (!business || !business.passwordHash) {
    throw new Error('Invalid credentials');
  }

  const valid = await bcrypt.compare(input.password, business.passwordHash);

  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(business.id, business.email);

  const { passwordHash: _, isAdmin, ...businessData } = business;

  // Only include isAdmin in response if user is actually an admin
  // This prevents leaking role information to regular businesses
  if (isAdmin) {
    return { business: { ...businessData, isAdmin: true as const }, token };
  }

  return { business: businessData, token };
}

export async function getBusiness(businessId: string) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      plan: true,
      businessType: true,
      isAdmin: true,
      googleReviewUrl: true,
      createdAt: true,
    },
  });

  if (!business) {
    throw new Error('Business not found');
  }

  // Only include isAdmin in response if user is actually an admin
  // This prevents leaking role information to regular businesses
  const { isAdmin, ...businessData } = business;
  if (isAdmin) {
    return { ...businessData, isAdmin: true as const };
  }

  return businessData;
}

function generateToken(businessId: string, email: string): string {
  return jwt.sign({ businessId, email }, env.JWT_SECRET, {
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

export async function getOnboardingStatus(businessId: string): Promise<OnboardingStatus> {
  const [platformConnection, reviewCount, approvedResponseCount] = await Promise.all([
    prisma.platformConnection.findFirst({
      where: { businessId, platform: 'GOOGLE', isActive: true },
      select: { id: true },
    }),
    prisma.review.count({
      where: { businessId },
    }),
    prisma.response.count({
      where: { businessId, status: 'APPROVED' },
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
