const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';
export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied';
}

const API_URL = `${API_BASE_URL}/api`;

export const getMessages = async (): Promise<Message[]> => {
  try {
    const res = await fetch(`${API_URL}/messages`);
    return await res.json();
  } catch (e) {
    console.error('Failed to parse messages', e);
    return [];
  }
};

export const saveMessage = async (msg: Omit<Message, 'id' | 'timestamp' | 'status'>) => {
  const newMessage: Message = {
    ...msg,
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    status: 'unread'
  };
  try {
    await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage)
    });
    window.dispatchEvent(new Event('messages_updated'));
    return newMessage;
  } catch (e) {
    console.error('Failed to save message:', e);
  }
};

export const updateMessageStatus = async (id: string, status: 'unread' | 'read' | 'replied') => {
  try {
    await fetch(`${API_URL}/messages/${id}/${status === 'replied' ? 'reply' : 'read'}`, {
      method: 'PUT'
    });
    window.dispatchEvent(new Event('messages_updated'));
  } catch (e) {
    console.error('Failed to update message:', e);
  }
};

export const deleteMessage = async (id: string) => {
  try {
    await fetch(`${API_URL}/messages/${id}`, {
      method: 'DELETE'
    });
    window.dispatchEvent(new Event('messages_updated'));
  } catch (e) {
    console.error('Failed to delete message:', e);
  }
};
