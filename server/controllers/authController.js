// // // // import jwt from 'jsonwebtoken';
// // // // import User from '../models/User.js';

// // // // const generateToken = (userId) => {
// // // //   return jwt.sign({ userId }, process.env.JWT_SECRET, {
// // // //     expiresIn: process.env.JWT_EXPIRE || '7d'
// // // //   });
// // // // };

// // // // export const login = async (req, res) => {
// // // //   try {
// // // //     const { email, password, role } = req.body;

// // // //     // Validate input
// // // //     if (!email || !password || !role) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'Please provide email, password, and role'
// // // //       });
// // // //     }

// // // //     // Check if user exists
// // // //     const user = await User.findOne({ 
// // // //       email: email.toLowerCase(),
// // // //       role: role.toLowerCase() 
// // // //     }).select('+password');

// // // //     if (!user) {
// // // //       return res.status(401).json({
// // // //         success: false,
// // // //         message: 'Invalid credentials'
// // // //       });
// // // //     }

// // // //     // Check if user is active
// // // //     if (!user.isActive) {
// // // //       return res.status(401).json({
// // // //         success: false,
// // // //         message: 'Account is deactivated. Contact administrator.'
// // // //       });
// // // //     }

// // // //     // Check password
// // // //     const isPasswordValid = await user.comparePassword(password);
// // // //     if (!isPasswordValid) {
// // // //       return res.status(401).json({
// // // //         success: false,
// // // //         message: 'Invalid credentials'
// // // //       });
// // // //     }

// // // //     // Update last login
// // // //     user.lastLogin = new Date();
// // // //     await user.save();

// // // //     // Generate token
// // // //     const token = generateToken(user._id);

// // // //     // Remove password from response
// // // //     const userResponse = user.toObject();
// // // //     delete userResponse.password;

// // // //     res.status(200).json({
// // // //       success: true,
// // // //       message: 'Login successful',
// // // //       data: {
// // // //         token,
// // // //         user: userResponse
// // // //       }
// // // //     });
// // // //   } catch (error) {
// // // //     console.error('Login error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Login failed. Please try again.'
// // // //     });
// // // //   }
// // // // };

// // // // export const getProfile = async (req, res) => {
// // // //   try {
// // // //     if (!req.user) {
// // // //       return res.status(401).json({
// // // //         success: false,
// // // //         message: 'Not authenticated'
// // // //       });
// // // //     }

// // // //     res.status(200).json({
// // // //       success: true,
// // // //       data: {
// // // //         user: req.user
// // // //       }
// // // //     });
// // // //   } catch (error) {
// // // //     console.error('Get profile error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Failed to get profile'
// // // //     });
// // // //   }
// // // // };

// // // // export const logout = async (req, res) => {
// // // //   try {
// // // //     res.status(200).json({
// // // //       success: true,
// // // //       message: 'Logout successful'
// // // //     });
// // // //   } catch (error) {
// // // //     console.error('Logout error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Logout failed'
// // // //     });
// // // //   }
// // // // };
// // import jwt from 'jsonwebtoken';
// // import User from '../models/User.js';
// // import bcrypt from 'bcrypt';

// // const generateToken = (userId, role) => {
// //   return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
// //     expiresIn: process.env.JWT_EXPIRE || '7d'
// //   });
// // };

// // export const login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     // Validate input
// //     if (!email || !password) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Please provide email and password'
// //       });
// //     }

// //     // email ya rollNumber se dhoondo (email: faculty/prof/admin, roll: student)
// //     let user = null;
// //     if (email.includes('@')) {
// //       user = await User.findOne({ email: email.toLowerCase() });
// //     } else {
// //       user = await User.findOne({ rollNumber: email });
// //     }

// //     if (!user) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Invalid credentials'
// //       });
// //     }

// //     // optional: deactivated field (agar schema mein hai)
// //     if ('isActive' in user && user.isActive === false) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Account is deactivated. Contact administrator.'
// //       });
// //     }

// //     // Password/hash check
// //     const hash = user.hash || user.password;
// //     if (!hash) {
// //       return res.status(500).json({
// //         success: false,
// //         message: 'User has no password set'
// //       });
// //     }
// //     const isValid = await bcrypt.compare(password, hash);
// //     if (!isValid) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Invalid credentials'
// //       });
// //     }

// //     // Update last login (optional)
// //     user.lastLogin = new Date();
// //     await user.save();

// //     // Generate JWT
// //     const token = generateToken(user._id, user.role);

// //     // Response - no hash/password leaked
// //     const userObj = user.toObject();
// //     delete userObj.hash;
// //     delete userObj.password;

// //     res.status(200).json({
// //       success: true,
// //       message: 'Login successful',
// //       data: {
// //         token,
// //         user: userObj
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Login error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Login failed. Please try again.'
// //     });
// //   }
// // };

// // export const getProfile = async (req, res) => {
// //   try {
// //     if (!req.user) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Not authenticated'
// //       });
// //     }
// //     res.status(200).json({
// //       success: true,
// //       data: { user: req.user }
// //     });
// //   } catch (error) {
// //     console.error('Get profile error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to get profile'
// //     });
// //   }
// // };

// // export const logout = async (req, res) => {
// //   try {
// //     res.status(200).json({
// //       success: true,
// //       message: 'Logout successful'
// //     });
// //   } catch (error) {
// //     console.error('Logout error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Logout failed'
// //     });
// //   }
// // };
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import bcrypt from 'bcryptjs';

// const generateToken = (userId, role) => {
//   return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE || '7d'
//   });
// };

// // export const login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     if (!email || !password) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Please provide email and password'
// //       });
// //     }

// //     let user = null;
// //     if (email.includes('@')) {
// //       user = await User.findOne({ email: email.toLowerCase() });
// //     } else {
// //       user = await User.findOne({ rollNumber: email });
// //     }

// //     if (!user) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Invalid credentials'
// //       });
// //     }

// //     if ('isActive' in user && user.isActive === false) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Account is deactivated. Contact administrator.'
// //       });
// //     }

// //     const hash = user.hash || user.password;
// //     if (!hash) {
// //       return res.status(500).json({
// //         success: false,
// //         message: 'User has no password set'
// //       });
// //     }

// //     const isValid = await bcrypt.compare(password, hash);
// //     if (!isValid) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Invalid credentials'
// //       });
// //     }

// //     user.lastLogin = new Date();
// //     await user.save();

// //     const token = generateToken(user._id, user.role);
// //     const userObj = user.toObject();
// //     delete userObj.hash;
// //     delete userObj.password;

// //     res.status(200).json({
// //       success: true,
// //       message: 'Login successful',
// //       data: { token, user: userObj }
// //     });
// //   } catch (error) {
// //     console.error('Login error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Login failed. Please try again.'
// //     });
// //   }
// // };


// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide email and password'
//       });
//     }

//     let user = null;
//     if (email.includes('@')) {
//       user = await User.findOne({ email: email.toLowerCase() }).select('+password');
//     } else {
//       user = await User.findOne({ rollNumber: email }).select('+password');
//     }

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     if ('isActive' in user && user.isActive === false) {
//       return res.status(401).json({
//         success: false,
//         message: 'Account is deactivated. Contact administrator.'
//       });
//     }

//     if (!user.password) {
//       return res.status(500).json({
//         success: false,
//         message: 'User has no password set'
//       });
//     }

//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     user.lastLogin = new Date();
//     await user.save();

//     const token = generateToken(user._id, user.role);
//     const userObj = user.toObject();
//     delete userObj.password;

//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       data: { token, user: userObj }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Login failed. Please try again.'
//     });
//   }
// };

// export const getProfile = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ success: false, message: 'Not authenticated' });
//     }
//     res.status(200).json({ success: true, data: { user: req.user } });
//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({ success: false, message: 'Failed to get profile' });
//   }
// };

// export const logout = async (req, res) => {
//   try {
//     res.status(200).json({ success: true, message: 'Logout successful' });
//   } catch (error) {
//     console.error('Logout error:', error);
//     res.status(500).json({ success: false, message: 'Logout failed' });
//   }
// };

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Debug: Log incoming request
    console.log('🔐 Login attempt:', {
      email,
      role,
      passwordLength: password?.length
    });

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user with role filter and explicitly select password
    const user = await User.findOne({
      email: email.toLowerCase(),
      ...(role && { role: role.toLowerCase() })
    }).select('+password');

    // Debug: Check if user exists
    console.log('👤 User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('📧 User email:', user.email);
      console.log('🎭 User role:', user.role);
      console.log('🔒 Password field exists:', user.password ? 'Yes' : 'No');
      console.log('🔒 Password hash (first 20 chars):', user.password?.substring(0, 20));
    }

    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      console.log('❌ User account is deactivated');
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Contact administrator.'
      });
    }

    // Check if password exists
    if (!user.password) {
      console.log('❌ User has no password set in database');
      return res.status(500).json({
        success: false,
        message: 'User has no password set'
      });
    }

    // Compare password
    console.log('🔍 Comparing password...');
    console.log('   Input password:', password);
    console.log('   Stored hash:', user.password);
    
    const isValid = await bcrypt.compare(password, user.password);
    console.log('✅ Password match result:', isValid);

    if (!isValid) {
      console.log('❌ Password does not match');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    // Prepare response (remove password)
    const userObj = user.toObject();
    delete userObj.password;

    console.log('✅ Login successful for user:', user.email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token, user: userObj }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    res.status(200).json({
      success: true,
      data: { user: req.user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};
