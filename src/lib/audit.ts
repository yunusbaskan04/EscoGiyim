import { db } from './db';

export type ActivityAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'SOFT_DELETE'
  | 'RESTORE'
  | 'REORDER'
  | 'SETTINGS_UPDATE';

export type EntityType =
  | 'School'
  | 'Product'
  | 'Gallery'
  | 'FAQ'
  | 'Announcement'
  | 'Settings'
  | 'Admin';

export async function logActivity(params: {
  adminId?: string;
  action: ActivityAction;
  entityType: EntityType;
  entityId?: string;
  details?: string | Record<string, unknown>;
}) {
  try {
    const detailsString =
      typeof params.details === 'object'
        ? JSON.stringify(params.details)
        : params.details;

    await db.activityLog.create({
      data: {
        adminId: params.adminId || 'system',
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        details: detailsString,
      },
    });
  } catch (error) {
    console.error('Failed to write activity log:', error);
  }
}
