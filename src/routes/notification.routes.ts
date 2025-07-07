import express from 'express';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { fetchNotifications, markReadNotification } from '../controllers/notification.controller';

const router = express.Router();

router.get('/', verifyAuth, fetchNotifications);
router.put('/:notificationId', verifyAuth, markReadNotification);

export default router;