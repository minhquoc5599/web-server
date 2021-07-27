import { Router } from 'express';
import chatbotService from '../../bussiness/services/chatbot.service.js';

const router = Router();

router.post('/webhook', chatbotService.postWebHook);

router.get('/webhook', chatbotService.getWebHook);

router.post('/setup-profile', chatbotService.setupProfile);

router.post('/setup-persistent-menu', chatbotService.setupPersistentMenu);

export default router;