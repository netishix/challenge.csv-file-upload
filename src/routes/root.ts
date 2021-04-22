import express from 'express';

const router = express.Router();

/* GET root */
router.get('/', async (req, res) => {
  res.status(200).send('Everything looks OK. Server is up and running.');
});

export default router;
