import AuthService from '../../services/AuthService.js';
import { setAuthCookie } from '../../middleware/auth.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const { user, token } = await AuthService.login(email, password);
    
    setAuthCookie(res, token);
    
    res.json({
      success: true,
      message: 'Logged in successfully',
      redirect: ['super_admin', 'admin', 'staff'].includes(user.role) ? '/admin' : '/account',
      user
    });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, agree_terms } = req.body;
    
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    
    if (!agree_terms) {
      return res.status(400).json({ success: false, error: 'You must agree to the terms' });
    }

    const { user, token } = await AuthService.register({ first_name, last_name, email, password });
    
    setAuthCookie(res, token);
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      redirect: '/account',
      user
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    res.json({ success: true, message: 'Logged out successfully' });
  } else {
    res.redirect('/login');
  }
};
