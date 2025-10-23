import express from 'express';
const router = express.Router();


router.get('/', (req, res) => {
    res.send('Test get request')
});


export default router;