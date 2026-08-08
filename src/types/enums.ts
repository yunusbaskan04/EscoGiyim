export const GalleryCategory = {
  STORE: 'STORE',
  PRODUCT: 'PRODUCT',
  TAILORING: 'TAILORING',
  OTHER: 'OTHER',
} as const;

export type GalleryCategory = (typeof GalleryCategory)[keyof typeof GalleryCategory];

export const AnnouncementStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type AnnouncementStatus = (typeof AnnouncementStatus)[keyof typeof AnnouncementStatus];
