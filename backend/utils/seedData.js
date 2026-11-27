const Channel = require('../models/Channel');
const User = require('../models/User');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');

const initialChannels = [
  {
    name: 'general',
    description: 'Company-wide updates, open discussions, and general collaboration.',
    isPrivate: false,
    createdBy: 'system'
  },
  {
    name: 'engineering',
    description: 'System design, microservices latency, and distributed state coordination.',
    isPrivate: false,
    createdBy: 'system'
  },
  {
    name: 'announcements',
    description: 'Deployment schedules, version bumps, and smoke testing verification.',
    isPrivate: false,
    createdBy: 'system'
  },
  {
    name: 'security-and-compliance',
    description: 'Private room for access controls, secret hygiene, and penetration audit reviews.',
    isPrivate: true,
    createdBy: 'system'
  }
];

const initialUsers = [
  {
    name: 'Technical Support Engineer',
    email: 'support.engineer@pulse.internal',
    password: 'password123',
    role: 'Technical Support Engineer & Full-Stack',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'online'
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.vance@pulse.internal',
    password: 'password123',
    role: 'Principal DevOps Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'online'
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@pulse.internal',
    password: 'password123',
    role: 'Lead Frontend Systems Engineer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'away'
  }
];

async function seedPulseIfEmpty() {
  try {
    const channelCount = await Channel.countDocuments();
    let seededChannels = [];
    if (channelCount === 0) {
      console.log('[Pulse Seeder] Seeding default channels into MongoDB pulse...');
      seededChannels = await Channel.insertMany(initialChannels);
      console.log(`[Pulse Seeder] Seeded ${seededChannels.length} channels.`);
    } else {
      seededChannels = await Channel.find();
    }

    const userCount = await User.countDocuments();
    let seededUsers = [];
    if (userCount === 0) {
      console.log('[Pulse Seeder] Seeding default users into MongoDB pulse...');
      for (const u of initialUsers) {
        const hash = await bcrypt.hash(u.password, 10);
        const userDoc = new User({ ...u, password: hash });
        await userDoc.save();
        seededUsers.push(userDoc);
      }
      console.log(`[Pulse Seeder] Seeded ${seededUsers.length} users.`);
    } else {
      seededUsers = await User.find();
    }

    const messageCount = await Message.countDocuments();
    if (messageCount === 0 && seededChannels.length > 0 && seededUsers.length > 0) {
      const room = seededChannels[0];
      const u1 = seededUsers[0];
      const u2 = seededUsers[1];

      await Message.insertMany([
        {
          roomId: String(room._id),
          sender: { id: String(u1._id), name: u1.name, avatar: u1.avatar, role: u1.role },
          text: 'Welcome to Pulse! The low-latency Socket.IO and MongoDB real-time stream is active.',
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          roomId: String(room._id),
          sender: { id: String(u2._id), name: u2.name, avatar: u2.avatar, role: u2.role },
          text: 'All WebSocket listeners acknowledged. Zero packet drop verified across all channels.',
          createdAt: new Date(Date.now() - 1800000)
        }
      ]);
      console.log('[Pulse Seeder] Seeded initial welcome messages.');
    }
  } catch (err) {
    console.warn('[Pulse Seeder] Seeding warning:', err.message);
  }
}

module.exports = { seedPulseIfEmpty };
