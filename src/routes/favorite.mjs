import { Router } from 'express';
import User from '../models/Users.mjs';
import {ensureAuthenticated} from '../middlewares/auth.mjs';

const router = Router();

router.post('/add', ensureAuthenticated, async (req, res) => {
  try {
    const {id} = req.body;
    const user = await User.findById(req.user._id);

    const index = user.featuredFood.indexOf(id)
    if(index === -1){
      user.featuredFood.push(id);
      await user.save();
      return res.json({success: true, added: true});
    } else {
      user.featuredFood.splice(index,1);
      await user.save();
      return res.json({success: true, added: false});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

export default router;
