/**
 * Notification Batching Service
 * Prevents notification spam by batching messages over 5-minute windows
 */

interface BatchedMessage {
  workspaceId: string;
  workspaceName: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}

interface WorkspaceBatch {
  workspaceId: string;
  workspaceName: string;
  messages: BatchedMessage[];
  firstMessageTime: Date;
  timeoutId: NodeJS.Timeout | null;
}

// Batching configuration
const BATCH_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const workspaceBatches = new Map<string, WorkspaceBatch>();

/**
 * Add a message to the batch
 * Will immediately show notification for first message, then batch subsequent ones
 */
export function addMessageToBatch(
  workspaceId: string,
  workspaceName: string,
  senderId: string,
  senderName: string,
  messageText: string
): void {
  const existingBatch = workspaceBatches.get(workspaceId);

  if (!existingBatch) {
    // First message in this workspace - show immediately
    showImmediateNotification(workspaceId, workspaceName, senderName, messageText);

    // Start a new batch for subsequent messages
    const timeoutId = setTimeout(() => {
      sendBatchedNotification(workspaceId);
    }, BATCH_WINDOW_MS);

    workspaceBatches.set(workspaceId, {
      workspaceId,
      workspaceName,
      messages: [
        {
          workspaceId,
          workspaceName,
          senderId,
          senderName,
          text: messageText,
          timestamp: new Date(),
        },
      ],
      firstMessageTime: new Date(),
      timeoutId,
    });
  } else {
    // Add to existing batch (don't show notification yet)
    existingBatch.messages.push({
      workspaceId,
      workspaceName,
      senderId,
      senderName,
      text: messageText,
      timestamp: new Date(),
    });

    console.log(
      `Batched message in ${workspaceName}. Total: ${existingBatch.messages.length} messages`
    );
  }
}

/**
 * Show immediate notification for the first message
 */
function showImmediateNotification(
  workspaceId: string,
  workspaceName: string,
  senderName: string,
  messageText: string
): void {
  if (Notification.permission !== 'granted') return;

  // Don't show if user is actively viewing this workspace
  if (document.hidden === false && window.location.pathname.includes(workspaceId)) {
    console.log('User is viewing workspace, skipping notification');
    return;
  }

  const truncatedText = messageText.length > 100 ? messageText.substring(0, 100) + '...' : messageText;

  const notification = new Notification(`${senderName} • ${workspaceName}`, {
    body: truncatedText,
    icon: '/logo.gif',
    badge: '/logo.gif',
    tag: `message-${workspaceId}-immediate`,
    requireInteraction: false,
    silent: false,
  });

  notification.onclick = () => {
    window.focus();
    window.location.href = `/workspaces/${workspaceId}`;
    notification.close();
  };

  // Auto-close after 5 seconds
  setTimeout(() => notification.close(), 5000);

  // Play sound
  playNotificationSound();
  vibrateDevice(200);
}

/**
 * Send batched notification after 5 minutes
 */
function sendBatchedNotification(workspaceId: string): void {
  const batch = workspaceBatches.get(workspaceId);
  if (!batch || batch.messages.length <= 1) {
    // Only 1 message (already shown) or no messages
    workspaceBatches.delete(workspaceId);
    return;
  }

  // More than 1 message - send summary
  const messageCount = batch.messages.length;
  const uniqueSenders = new Set(batch.messages.map((m) => m.senderName));
  const senderNames = Array.from(uniqueSenders);

  let body: string;
  if (senderNames.length === 1) {
    body = `${senderNames[0]} sent ${messageCount} messages`;
  } else {
    body = `${messageCount} new messages from ${senderNames.length} people`;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(`${batch.workspaceName}`, {
      body,
      icon: '/logo.gif',
      badge: '/logo.gif',
      tag: `message-${workspaceId}-batch`,
      requireInteraction: false,
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = `/workspaces/${workspaceId}`;
      notification.close();
    };

    setTimeout(() => notification.close(), 6000);

    // Play sound
    playNotificationSound();
    vibrateDevice([200, 100, 200]);
  }

  // Clear the batch
  workspaceBatches.delete(workspaceId);
}

/**
 * Flush all batches immediately (e.g., when user opens the app)
 */
export function flushAllBatches(): void {
  workspaceBatches.forEach((batch, workspaceId) => {
    if (batch.timeoutId) {
      clearTimeout(batch.timeoutId);
    }
    sendBatchedNotification(workspaceId);
  });
  workspaceBatches.clear();
}

/**
 * Clear batch for a specific workspace (e.g., when user opens that workspace)
 */
export function clearBatchForWorkspace(workspaceId: string): void {
  const batch = workspaceBatches.get(workspaceId);
  if (batch?.timeoutId) {
    clearTimeout(batch.timeoutId);
  }
  workspaceBatches.delete(workspaceId);
}

/**
 * Get current batch status (for debugging)
 */
export function getBatchStatus(): { workspaceId: string; messageCount: number; timeRemaining: number }[] {
  const status: { workspaceId: string; messageCount: number; timeRemaining: number }[] = [];

  workspaceBatches.forEach((batch, workspaceId) => {
    const elapsed = Date.now() - batch.firstMessageTime.getTime();
    const remaining = Math.max(0, BATCH_WINDOW_MS - elapsed);

    status.push({
      workspaceId,
      messageCount: batch.messages.length,
      timeRemaining: Math.round(remaining / 1000), // in seconds
    });
  });

  return status;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Play notification sound
 */
function playNotificationSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Play a pleasant notification chime (C - E - G chord)
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const startTime = audioContext.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  } catch {
    // Audio not supported
  }
}

/**
 * Vibrate device if supported
 */
function vibrateDevice(pattern: number | number[]): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}
