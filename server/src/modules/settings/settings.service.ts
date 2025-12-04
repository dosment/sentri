import { prisma } from '../../config/database.js';

export interface DealerSettings {
  autoPostEnabled: boolean;
  autoPostThreshold: number;
  negativeThreshold: number;
  responseTone: string;
  signOffName: string | null;
  signOffTitle: string | null;
}

export interface UpdateSettingsInput {
  autoPostEnabled?: boolean;
  autoPostThreshold?: number;
  negativeThreshold?: number;
  responseTone?: string;
  signOffName?: string | null;
  signOffTitle?: string | null;
}

export async function getSettings(dealerId: string): Promise<DealerSettings> {
  const dealer = await prisma.dealer.findUnique({
    where: { id: dealerId },
    select: {
      autoPostEnabled: true,
      autoPostThreshold: true,
      negativeThreshold: true,
      responseTone: true,
      signOffName: true,
      signOffTitle: true,
    },
  });

  if (!dealer) {
    throw new Error('Dealer not found');
  }

  return dealer;
}

export async function updateSettings(
  dealerId: string,
  input: UpdateSettingsInput
): Promise<DealerSettings> {
  // Validate input ranges
  if (input.autoPostThreshold !== undefined) {
    if (input.autoPostThreshold < 1 || input.autoPostThreshold > 5) {
      throw new Error('autoPostThreshold must be between 1 and 5');
    }
  }

  if (input.negativeThreshold !== undefined) {
    if (input.negativeThreshold < 1 || input.negativeThreshold > 5) {
      throw new Error('negativeThreshold must be between 1 and 5');
    }
  }

  if (input.responseTone !== undefined) {
    if (!['professional', 'neighborly'].includes(input.responseTone)) {
      throw new Error('responseTone must be "professional" or "neighborly"');
    }
  }

  const dealer = await prisma.dealer.update({
    where: { id: dealerId },
    data: input,
    select: {
      autoPostEnabled: true,
      autoPostThreshold: true,
      negativeThreshold: true,
      responseTone: true,
      signOffName: true,
      signOffTitle: true,
    },
  });

  return dealer;
}
