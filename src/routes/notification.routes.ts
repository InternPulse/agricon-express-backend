import express from 'express';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { fetchNotifications, markReadNotification, deleteNotification, getNotification } from '../controllers/notification.controller';

const router = express.Router();

router.get('/', verifyAuth, fetchNotifications);
router.put('/:notificationId', verifyAuth, markReadNotification);
router.delete('/:id', verifyAuth, deleteNotification);
router.get('/:id', verifyAuth, getNotification);

export default router;