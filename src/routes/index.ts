import express from 'express';
import vehicles from './vehicles';
import root from './root';

const router = express.Router();

router.use('/', root);
router.use('/vehicles', vehicles);

export default router;
