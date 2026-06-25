const fs = require('fs');

let content = fs.readFileSync('server/index.js', 'utf8');

const crudRoutes = `
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
`;

if (!content.includes('/api/artifacts/:id')) {
  content += crudRoutes;
  fs.writeFileSync('server/index.js', content);
  console.log('Routes added');
} else {
  console.log('Routes already exist');
}
