import { prisma } from '../../config/database.js';
import { encryptToken, decryptToken, isEncrypted } from '../../lib/crypto.js';
import { Platform } from '@prisma/client';

interface TokenData {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: Date | null;
}

interface CreateConnectionInput {
  dealerId: string;
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
      dealerId: input.dealerId,
      platform: input.platform,
      platformAccountId: input.platformAccountId,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      tokenExpiresAt: input.tokens.expiresAt,
      isActive: true,
    },
  });
}

export async function getPlatformConnection(dealerId: string, platform: Platform) {
  const connection = await prisma.platformConnection.findUnique({
    where: {
      dealerId_platform: { dealerId, platform },
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

export async function getActivePlatformConnections(dealerId: string) {
  const connections = await prisma.platformConnection.findMany({
    where: { dealerId, isActive: true },
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
  dealerId: string,
  platform: Platform,
  tokens: UpdateTokensInput
) {
  const encryptedAccessToken = encryptToken(tokens.accessToken);
  const encryptedRefreshToken = tokens.refreshToken
    ? encryptToken(tokens.refreshToken)
    : null;

  return prisma.platformConnection.update({
    where: {
      dealerId_platform: { dealerId, platform },
    },
    data: {
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      tokenExpiresAt: tokens.expiresAt,
    },
  });
}

export async function disconnectPlatform(dealerId: string, platform: Platform) {
  return prisma.platformConnection.update({
    where: {
      dealerId_platform: { dealerId, platform },
    },
    data: {
      isActive: false,
      accessToken: '', // Clear tokens on disconnect
      refreshToken: null,
    },
  });
}

export async function deletePlatformConnection(dealerId: string, platform: Platform) {
  return prisma.platformConnection.delete({
    where: {
      dealerId_platform: { dealerId, platform },
    },
  });
}

export async function updateLastSync(dealerId: string, platform: Platform) {
  return prisma.platformConnection.update({
    where: {
      dealerId_platform: { dealerId, platform },
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
