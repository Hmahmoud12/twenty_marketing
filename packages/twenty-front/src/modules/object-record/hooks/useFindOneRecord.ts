import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { ObjectMetadataItemIdentifier } from '@/object-metadata/types/ObjectMetadataItemIdentifier';
import { useMapRecordRelationConnectionsToRelationRecords } from '@/object-record/hooks/useMapRecordRelationConnectionsToRelationRecords';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';
import { isDefined } from '~/utils/isDefined';

// TODO: fix connection in relation => automatically change to an array
export const useFindOneRecord = <T extends ObjectRecord = ObjectRecord>({
  objectNameSingular,
  objectRecordId = '',
  onCompleted,
  depth,
  skip,
}: ObjectMetadataItemIdentifier & {
  objectRecordId: string | undefined;
  onCompleted?: (data: T) => void;
  skip?: boolean;
  depth?: number;
}) => {
  const { objectMetadataItem, findOneRecordQuery } = useObjectMetadataItem(
    { objectNameSingular },
    depth,
  );

  const { mapRecordRelationConnectionsToRelationRecords } =
    useMapRecordRelationConnectionsToRelationRecords();

  const { data, loading, error } = useQuery<
    { [nameSingular: string]: T },
    { objectRecordId: string }
  >(findOneRecordQuery, {
    skip: !objectMetadataItem || !objectRecordId || skip,
    variables: { objectRecordId },
    onCompleted: (data) => {
      const recordWithoutConnection =
        mapRecordRelationConnectionsToRelationRecords<T>({
          objectRecord: data[objectNameSingular],
          objectNameSingular,
          depth: 5,
        });

      if (isDefined(recordWithoutConnection)) {
        onCompleted?.(recordWithoutConnection);
      }
    },
  });

  const recordWithoutConnection = useMemo(
    () =>
      mapRecordRelationConnectionsToRelationRecords<T>({
        objectRecord: data?.[objectNameSingular],
        objectNameSingular,
        depth: 5,
      }),
    [data, mapRecordRelationConnectionsToRelationRecords, objectNameSingular],
  );

  return {
    record: recordWithoutConnection,
    loading,
    error,
  };
};
