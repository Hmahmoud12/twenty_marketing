export enum CalendarChannelVisibilityValue {
  Everything = 'SHARE_EVERYTHING',
  Metadata = 'METADATA',
}

export type CalendarChannel = {
  id: string;
  handle: string;
  isContactAutoCreationEnabled?: boolean;
  isSynced?: boolean;
  visibility: CalendarChannelVisibilityValue;
};
