export interface UUIDInfo {
  uuid: string;
  version: number;
  variant: string;
  timestamp?: string;
}

export function generateUUID(): string {
  // Generate RFC4122 version 4 UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function generateMultipleUUIDs(count: number): string[] {
  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    uuids.push(generateUUID());
  }
  return uuids;
}

export function parseUUID(uuid: string): UUIDInfo | null {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(uuid)) {
    return null;
  }
  
  const parts = uuid.split('-');
  const versionChar = parts[2][0];
  const version = parseInt(versionChar, 16);
  const variantChar = parts[3][0];
  
  let variant = 'Unknown';
  const variantBits = parseInt(variantChar, 16) & 0b1111;
  
  if (variantBits <= 0b0111) {
    variant = 'RFC 4122';
  } else if (variantBits <= 0b1011) {
    variant = 'Reserved (Microsoft)';
  } else if (variantBits <= 0b1101) {
    variant = 'Reserved (Future)';
  } else {
    variant = 'Reserved (NCS)';
  }
  
  return {
    uuid: uuid.toLowerCase(),
    version,
    variant,
    timestamp: version === 1 ? extractTimestampFromV1UUID(uuid) : undefined
  };
}

function extractTimestampFromV1UUID(uuid: string): string | undefined {
  // For version 1 UUIDs, extract the timestamp
  const parts = uuid.split('-');
  if (parts.length !== 5) return undefined;
  
  try {
    const timeLow = parseInt(parts[0], 16);
    const timeMid = parseInt(parts[1], 16);
    const timeHi = parseInt(parts[2].substring(1), 16); // Remove version bit
    
    // Reconstruct 60-bit timestamp
    const timestamp = ((timeHi & 0x0fff) << 48) | (timeMid << 16) | timeLow;
    
    // UUID timestamp is 100-nanosecond intervals since UUID epoch (October 15, 1582)
    const uuidEpoch = Date.UTC(1582, 9, 15, 0, 0, 0, 0);
    const timestampMs = (timestamp - 0x01b21dd213814000) / 10000 + uuidEpoch;
    
    return new Date(timestampMs).toISOString();
  } catch (e) {
    return undefined;
  }
}

export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function getUUIDVersionInfo(version: number) {
  const versions = {
    1: {
      name: 'Version 1',
      description: 'Time-based UUID',
      useCase: 'Distributed systems, databases',
      security: 'Low - contains timestamp and MAC address'
    },
    2: {
      name: 'Version 2',
      description: 'DCE Security UUID',
      useCase: 'DCE (Distributed Computing Environment)',
      security: 'Low - similar to v1 with local user ID'
    },
    3: {
      name: 'Version 3',
      description: 'MD5 hash-based UUID',
      useCase: 'Namespace-based generation',
      security: 'Medium - depends on MD5 security'
    },
    4: {
      name: 'Version 4',
      description: 'Random UUID',
      useCase: 'General purpose, most common',
      security: 'High - cryptographically random'
    },
    5: {
      name: 'Version 5',
      description: 'SHA-1 hash-based UUID',
      useCase: 'Namespace-based generation',
      security: 'High - uses SHA-1'
    }
  };
  
  return versions[version as keyof typeof versions] || {
    name: `Version ${version}`,
    description: 'Unknown version',
    useCase: 'Unknown',
    security: 'Unknown'
  };
}
