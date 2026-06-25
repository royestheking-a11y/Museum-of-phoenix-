require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const Artifact = require('./models/Artifact');
const Message = require('./models/Message');
const Payment = require('./models/Payment');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Artifacts ---
app.get('/api/artifacts', async (req, res) => {
  try {
    const filter = req.query.hall ? { hall: req.query.hall } : {};
    const artifacts = await Artifact.find(filter);
    res.json(artifacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Messages ---
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/messages/:id/read', async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate({ id: req.params.id }, { status: 'read' }, { new: true });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/messages/:id/reply', async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate({ id: req.params.id }, { status: 'replied' }, { new: true });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    await Message.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Payments ---
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ submittedAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payments', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/payments/:id/status', async (req, res) => {
  try {
    const updateData = { status: req.body.status };
    if (req.body.adminNote) updateData.adminNote = req.body.adminNote;
    if (req.body.status === 'confirmed') updateData.confirmedAt = new Date().toISOString();
    if (req.body.status === 'rejected') updateData.rejectedAt = new Date().toISOString();
    
    const payment = await Payment.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const User = require('./models/User');
const Course = require('./models/Course');
const Article = require('./models/Article');
const ResearchPaper = require('./models/ResearchPaper');
const TimelineEvent = require('./models/TimelineEvent');

// --- Users ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, level } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, level });
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const userResponse = user.toObject();
      delete userResponse.password;
      res.json(userResponse);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Courses ---
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ id: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Articles ---
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ id: 1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Research ---
app.get('/api/research', async (req, res) => {
  try {
    const research = await ResearchPaper.find().sort({ id: 1 });
    res.json(research);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Timeline Events ---
app.get('/api/timeline', async (req, res) => {
  try {
    const events = await TimelineEvent.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Users ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRUD API Additions ---

// Artifacts
app.post('/api/artifacts', async (req, res) => {
  try {
    const Artifact = require('./models/Artifact');
    const newDoc = new Artifact(req.body);
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.put('/api/artifacts/:id', async (req, res) => {
  try {
    const Artifact = require('./models/Artifact');
    const updated = await Artifact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.delete('/api/artifacts/:id', async (req, res) => {
  try {
    const Artifact = require('./models/Artifact');
    await Artifact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Users
app.put('/api/users/:id', async (req, res) => {
  try {
    const User = require('./models/User');
    // Don't allow password update here for security
    const { password, ...updateData } = req.body;
    const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.delete('/api/users/:id', async (req, res) => {
  try {
    const User = require('./models/User');
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Articles
app.post('/api/articles', async (req, res) => {
  try {
    const Article = require('./models/Article');
    if (!req.body.id) req.body.id = Date.now();
    const newDoc = new Article(req.body);
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.put('/api/articles/:id', async (req, res) => {
  try {
    const Article = require('./models/Article');
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const Article = require('./models/Article');
    await Article.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Courses
app.post('/api/courses', async (req, res) => {
  try {
    const Course = require('./models/Course');
    if (!req.body.id) req.body.id = Date.now();
    const newDoc = new Course(req.body);
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.put('/api/courses/:id', async (req, res) => {
  try {
    const Course = require('./models/Course');
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.delete('/api/courses/:id', async (req, res) => {
  try {
    const Course = require('./models/Course');
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});
