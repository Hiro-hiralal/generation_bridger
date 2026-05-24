import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Progress, Recording, AppMode } from '../types';

interface FamilyBridgeDB extends DBSchema {
  progress: {
    key: string;
    value: Progress;
  };
  recordings: {
    key: number;
    value: Recording;
    indexes: { by_phrase: string; by_mode: string };
  };
}

let dbPromise: Promise<IDBPDatabase<FamilyBridgeDB>> | null = null;

function getDB(): Promise<IDBPDatabase<FamilyBridgeDB>> {
  if (!dbPromise) {
    dbPromise = openDB<FamilyBridgeDB>('family-bridge-db', 1, {
      upgrade(db) {
        db.createObjectStore('progress', { keyPath: 'phrase_id' });
        const recStore = db.createObjectStore('recordings', {
          keyPath: 'id',
          autoIncrement: true,
        });
        recStore.createIndex('by_phrase', 'phrase_id');
        recStore.createIndex('by_mode', 'mode');
      },
    });
  }
  return dbPromise;
}

export async function getAllProgress(): Promise<Progress[]> {
  return (await getDB()).getAll('progress');
}

export async function putProgress(p: Progress): Promise<void> {
  await (await getDB()).put('progress', p);
}

export async function addRecording(r: Omit<Recording, 'id'>): Promise<number> {
  return (await getDB()).add('recordings', r as Recording);
}

export async function getRecordingsByPhrase(phraseId: string): Promise<Recording[]> {
  return (await getDB()).getAllFromIndex('recordings', 'by_phrase', phraseId);
}

export async function getRecordingsByMode(mode: AppMode): Promise<Recording[]> {
  if (!mode) return [];
  return (await getDB()).getAllFromIndex('recordings', 'by_mode', mode);
}
