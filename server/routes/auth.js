import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const isProd = process.env.NODE_ENV === 'production';

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      {expiresIn:'7d'}
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'strict',
      maxAge: 7 * 24 * 3600 * 1000
    })

    res.json({
      user: { username: user.username, name: user.name } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout',async(req,res)=>{
    res.clearCookie('token',{
        httpOnly:true,
    secure:isProd,
    sameSite:isProd ? 'none' : 'strict'
    })
    res.status(200).json({
        message:"Logged Out Successfully"
    })

})

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('username name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
