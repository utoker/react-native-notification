const express = require('express');
const { Expo } = require('expo-server-sdk');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const expo = new Expo();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Expo Push Notification Server',
    status: 'Running',
    endpoints: {
      'POST /send-notification': 'Send a single notification',
      'POST /send-batch-notifications': 'Send multiple notifications',
      'POST /check-receipts': 'Check notification delivery receipts',
      'GET /health': 'Health check endpoint'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/send-notification', async (req, res) => {
  const { pushToken, title, body, data = {}, sound = 'default' } = req.body;

  if (!pushToken || !title || !body) {
    return res.status(400).json({
      error: 'Missing required fields: pushToken, title, body'
    });
  }

  if (!Expo.isExpoPushToken(pushToken)) {
    return res.status(400).json({
      error: `Push token ${pushToken} is not a valid Expo push token`
    });
  }

  try {
    const message = {
      to: pushToken,
      sound: sound,
      title: title,
      body: body,
      data: data,
    };

    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];

    for (let chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending notification chunk:', error);
        return res.status(500).json({
          error: 'Failed to send notification',
          details: error.message
        });
      }
    }

    const receiptIds = tickets
      .filter(ticket => ticket.status === 'ok')
      .map(ticket => ticket.id);

    res.json({
      success: true,
      message: 'Notification sent successfully',
      tickets: tickets,
      receiptIds: receiptIds
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      error: 'Failed to send notification',
      details: error.message
    });
  }
});

app.post('/send-batch-notifications', async (req, res) => {
  const { notifications } = req.body;

  if (!notifications || !Array.isArray(notifications)) {
    return res.status(400).json({
      error: 'notifications must be an array of notification objects'
    });
  }

  const messages = [];
  const invalidTokens = [];

  for (let notification of notifications) {
    const { pushToken, title, body, data = {}, sound = 'default' } = notification;

    if (!pushToken || !title || !body) {
      continue;
    }

    if (!Expo.isExpoPushToken(pushToken)) {
      invalidTokens.push(pushToken);
      continue;
    }

    messages.push({
      to: pushToken,
      sound: sound,
      title: title,
      body: body,
      data: data,
    });
  }

  if (invalidTokens.length > 0) {
    return res.status(400).json({
      error: 'Invalid push tokens found',
      invalidTokens: invalidTokens
    });
  }

  if (messages.length === 0) {
    return res.status(400).json({
      error: 'No valid notifications to send'
    });
  }

  try {
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending notification chunk:', error);
        return res.status(500).json({
          error: 'Failed to send batch notifications',
          details: error.message
        });
      }
    }

    const receiptIds = tickets
      .filter(ticket => ticket.status === 'ok')
      .map(ticket => ticket.id);

    res.json({
      success: true,
      message: `Successfully sent ${messages.length} notifications`,
      tickets: tickets,
      receiptIds: receiptIds,
      totalSent: messages.length
    });

  } catch (error) {
    console.error('Error sending batch notifications:', error);
    res.status(500).json({
      error: 'Failed to send batch notifications',
      details: error.message
    });
  }
});

app.post('/check-receipts', async (req, res) => {
  const { receiptIds } = req.body;

  if (!receiptIds || !Array.isArray(receiptIds)) {
    return res.status(400).json({
      error: 'receiptIds must be an array of receipt IDs'
    });
  }

  try {
    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    const receipts = {};

    for (let chunk of receiptIdChunks) {
      try {
        const receiptChunk = await expo.getPushNotificationReceiptsAsync(chunk);
        Object.assign(receipts, receiptChunk);
      } catch (error) {
        console.error('Error getting receipts:', error);
        return res.status(500).json({
          error: 'Failed to get receipts',
          details: error.message
        });
      }
    }

    const successful = [];
    const failed = [];
    const errors = [];

    for (let receiptId in receipts) {
      const receipt = receipts[receiptId];
      if (receipt.status === 'ok') {
        successful.push(receiptId);
      } else if (receipt.status === 'error') {
        failed.push(receiptId);
        errors.push({
          receiptId: receiptId,
          error: receipt.message,
          details: receipt.details
        });
      }
    }

    res.json({
      success: true,
      receipts: receipts,
      summary: {
        total: receiptIds.length,
        successful: successful.length,
        failed: failed.length,
        errors: errors
      }
    });

  } catch (error) {
    console.error('Error checking receipts:', error);
    res.status(500).json({
      error: 'Failed to check receipts',
      details: error.message
    });
  }
});

app.post('/validate-token', (req, res) => {
  const { pushToken } = req.body;

  if (!pushToken) {
    return res.status(400).json({
      error: 'pushToken is required'
    });
  }

  const isValid = Expo.isExpoPushToken(pushToken);

  res.json({
    pushToken: pushToken,
    isValid: isValid,
    message: isValid ? 'Valid Expo push token' : 'Invalid Expo push token'
  });
});

const PORT = process.env.PORT || 3000;
const NGROK_URL = process.env.NGROK_URL;

app.listen(PORT, () => {
  console.log(`🚀 Expo Push Notification Server running on port ${PORT}`);
  console.log(`📱 Visit http://localhost:${PORT} for API documentation`);
  
  if (NGROK_URL) {
    console.log(`🌐 Public URL via ngrok: ${NGROK_URL}`);
    console.log(`🔗 Public Endpoints:`);
    console.log(`   POST ${NGROK_URL}/send-notification`);
    console.log(`   POST ${NGROK_URL}/send-batch-notifications`);
    console.log(`   POST ${NGROK_URL}/check-receipts`);
    console.log(`   POST ${NGROK_URL}/validate-token`);
    console.log(`   GET  ${NGROK_URL}/health`);
  } else {
    console.log(`🔗 Local Endpoints:`);
    console.log(`   POST http://localhost:${PORT}/send-notification`);
    console.log(`   POST http://localhost:${PORT}/send-batch-notifications`);
    console.log(`   POST http://localhost:${PORT}/check-receipts`);
    console.log(`   POST http://localhost:${PORT}/validate-token`);
    console.log(`   GET  http://localhost:${PORT}/health`);
    console.log(`\n💡 For tunnel mode access, run: ./start-with-ngrok.sh`);
  }
});