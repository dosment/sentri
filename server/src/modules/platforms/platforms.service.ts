import { prisma } from '../../config/database.js';
import { encryptToken, decryptToken, isEncrypted } from '../../lib/crypto.js';
import { Platform } from '@prisma/client';

interface TokenData {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: Date | null;
}

interface CreateConnectionInput {
  businessId: string;
  platform: Platform;
  platformAccountId: string;
  tokens: TokenData;
}

interface UpdateTokensInput {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: Date | null;
}

export async function createPlatformConnection(input: CreateConnectionInput) {
  const encryptedAccessToken = encryptToken(input.tokens.accessToken);
  const encryptedRefreshToken = input.tokens.refreshToken
    ? encryptToken(input.tokens.refreshToken)
    : null;

  return prisma.platformConnection.create({
    data: {
      businessId: input.businessId,
      platform: input.platform,
      platformAccountId: input.platformAccountId,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      tokenExpiresAt: input.tokens.expiresAt,
      isActive: true,
    },
  });
}

export async function getPlatformConnection(businessId: string, platform: Platform) {
  const connection = await prisma.platformConnection.findUnique({
    where: {
      businessId_platform: { businessId, platform },
    },
  });

  if (!connection) {
    return null;
  }

  return {
    ...connection,
    accessToken: decryptTokenSafe(connection.accessToken),
    refreshToken: connection.refreshToken
      ? decryptTokenSafe(connection.refreshToken)
      : null,
  };
}

export async function getActivePlatformConnections(businessId: string) {
  const connections = await prisma.platformConnection.findMany({
    where: { businessId, isActive: true },
  });

  return connections.map((conn) => ({
    ...conn,
    accessToken: decryptTokenSafe(conn.accessToken),
    refreshToken: conn.refreshToken
      ? decryptTokenSafe(conn.refreshToken)
      : null,
  }));
}

export async function updatePlatformTokens(
  businessId: string,
  platform: Platform,
  tokens: UpdateTokensInput
) {
  const encryptedAccessToken = encryptToken(tokens.accessToken);
  const encryptedRefreshToken = tokens.refreshToken
    ? encryptToken(tokens.refreshToken)
    : null;

  return prisma.platformConnection.update({
    where: {
      businessId_platform: { businessId, platform },
    },
    data: {
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      tokenExpiresAt: tokens.expiresAt,
    },
  });
}

export async function disconnectPlatform(businessId: string, platform: Platform) {
  return prisma.platformConnection.update({
    where: {
      businessId_platform: { businessId, platform },
    },
    data: {
      isActive: false,
      accessToken: '', // Clear tokens on disconnect
      refreshToken: null,
    },
  });
}

export async function deletePlatformConnection(businessId: string, platform: Platform) {
  return prisma.platformConnection.delete({
    where: {
      businessId_platform: { businessId, platform },
    },
  });
}

export async function updateLastSync(businessId: string, platform: Platform) {
  return prisma.platformConnection.update({
    where: {
      businessId_platform: { businessId, platform },
    },
    data: {
      lastSyncAt: new Date(),
    },
  });
}

function decryptTokenSafe(encryptedValue: string): string {
  if (!encryptedValue) {
    return '';
  }

  // Handle legacy unencrypted tokens during migration
  if (!isEncrypted(encryptedValue)) {
    console.warn('[SECURITY] Found unencrypted token - migration needed');
    return encryptedValue;
  }

  return decryptToken(encryptedValue);
}
