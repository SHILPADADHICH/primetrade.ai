import { Router } from 'express';
import { create, getAll, getOne, update, remove } from '../controllers/taskController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

// All task routes are protected
router.use(authenticate);

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
