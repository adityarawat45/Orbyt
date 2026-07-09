const { verifyToken } = require('@clerk/backend');
const { User } = require('../../models');
const { clerkSecretKey } = require('../config/env');

async function requireClerkAuth(req, res, next) {
  if (!clerkSecretKey) {
    return res.status(503).json({
      ok: false,
      error: 'Clerk is not configured. Set CLERK_SECRET_KEY before using authenticated routes.',
    });
  }

  const authHeader = req.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) {
    return res.status(401).json({ ok: false, error: 'Missing bearer token.' });
  }

  try {
    const claims = await verifyToken(token, { secretKey: clerkSecretKey });
    const clerkUserId = claims?.sub;

    if (!clerkUserId) {
      return res.status(401).json({ ok: false, error: 'Invalid Clerk token.' });
    }

    let user = await User.findOne({ where: { clerkUserId } });

    if (!user) {
      user = await User.create({
        clerkUserId,
        email: claims?.email || null,
        fullName: claims?.name || null,
      });
    } else if (claims?.email || claims?.name) {
      await user.update({
        email: claims?.email || user.email,
        fullName: claims?.name || user.fullName,
      });
    }

    req.auth = {
      userId: user.id,
      clerkUserId,
      claims,
    };
    req.user = user;

    return next();
  } catch (error) {
    console.error('Clerk authentication failed.', error);
    return res.status(401).json({ ok: false, error: 'Invalid or expired Clerk token.' });
  }
}

module.exports = {
  requireClerkAuth,
};
