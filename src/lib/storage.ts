import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'campaign_data.json');

interface LocalDB {
  threads: Record<string, any[]>; // userId -> threads[]
  messages: Record<string, any[]>; // threadId -> messages[]
}

function getDB(): LocalDB {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial: LocalDB = { threads: {}, messages: {} };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Local file storage read error:', e);
    return { threads: {}, messages: {} };
  }
}

function saveDB(db: LocalDB) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (e) {
    console.warn('Local file storage write error:', e);
  }
}

export const fileStore = {
  getThreads(userId: string) {
    const db = getDB();
    return db.threads[userId] || [];
  },
  saveThread(userId: string, thread: any) {
    const db = getDB();
    const existing = db.threads[userId] || [];
    db.threads[userId] = [thread, ...existing.filter((t) => t.id !== thread.id)];
    saveDB(db);
  },
  getMessages(threadId: string) {
    const db = getDB();
    return db.messages[threadId] || [];
  },
  saveMessage(threadId: string, message: any) {
    const db = getDB();
    const existing = db.messages[threadId] || [];
    db.messages[threadId] = [...existing, message];
    saveDB(db);
  },
  saveMessages(threadId: string, messages: any[]) {
    const db = getDB();
    const existing = db.messages[threadId] || [];
    db.messages[threadId] = [...existing, ...messages];
    saveDB(db);
  },
};

