import express from 'express';
import * as clientController from '../controllers/client.controller.js';

const router = express.Router();

router.post('/', clientController.createClient);
router.get('/', clientController.getClients);
router.get('/:id', clientController.getClient);

export default router;
