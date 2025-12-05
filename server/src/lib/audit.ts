import { prisma } from '../config/database.js';
import { AuditAction, Prisma } from '@prisma/client';

interface AuditLogEntry {
  actor: string;
  actorType?: 'user' | 'admin' | 'system';
  action: AuditAction;
  entity: string;
  entityId?: string;
  before?: Prisma.InputJsonValue;
  after?: Prisma.InputJsonValue;
  metadata?: Prisma.InputJsonValue;
}

/**
 * Log an audit event
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actor: entry.actor,
        actorType: entry.actorType || 'user',
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId,
        before: entry.before,
        after: entry.after,
        metadata: entry.metadata,
      },
    });
  } catch (error) {
    // Don't let audit failures break the main operation
    console.error('Failed to write audit log:', error);
  }
}

/**
 * Log admin action with request context
 */
export async function logAdminAction(
  adminEmail: string,
  action: AuditAction,
  entity: string,
  entityId: string,
  options?: {
    before?: Prisma.InputJsonValue;
    after?: Prisma.InputJsonValue;
    ip?: string;
    userAgent?: string;
  }
): Promise<void> {
  await logAudit({
    actor: adminEmail,
    actorType: 'admin',
    action,
    entity,
    entityId,
    before: options?.before,
    after: options?.after,
    metadata: {
      ip: options?.ip,
      userAgent: options?.userAgent,
    },
  });
}

/**
 * Log authentication event
 */
export async function logAuthEvent(
  email: string,
  action: 'LOGIN' | 'LOGOUT',
  metadata?: Prisma.InputJsonValue
): Promise<void> {
  await logAudit({
    actor: email,
    actorType: 'user',
    action: action as AuditAction,
    entity: 'Session',
    metadata,
  });
}
