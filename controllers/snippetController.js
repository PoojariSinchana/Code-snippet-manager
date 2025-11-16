const { Snippet, User } = require('../models');

// create snippet
exports.create = async (req, res) => {
  try {
    const { title, description, language, code, tags, public: isPublic, forkedFromId } = req.body;
    if (!title || !language || !code) return res.status(400).json({ message: 'Missing fields' });

    const snippet = await Snippet.create({
      title,
      description,
      language,
      code,
      tags: tags || [],
      public: typeof isPublic === 'boolean' ? isPublic : true,
      forkedFromId: forkedFromId || null,
      userId: req.userId
    });
    res.json(snippet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// list (with filters)
exports.list = async (req, res) => {
  try {
    const { language, tag } = req.query;
    const where = {};
    if (language) where.language = language;
    if (tag) where.tags = { [require('sequelize').Op.like]: `%${tag}%` };
    // show only public snippets plus user's own if token provided
    const snippets = await Snippet.findAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(snippets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// get one snippet (if public or owner)
exports.getOne = async (req, res) => {
  try {
    const snip = await Snippet.findByPk(req.params.id, { include: [{ model: User, as: 'author', attributes: ['id', 'name'] }] });
    if (!snip) return res.status(404).json({ message: 'Not found' });
    if (!snip.public && snip.userId !== req.userId) return res.status(403).json({ message: 'Private' });
    res.json(snip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// update (author only)
exports.update = async (req, res) => {
  try {
    const snip = await Snippet.findByPk(req.params.id);
    if (!snip) return res.status(404).json({ message: 'Not found' });
    if (snip.userId !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    await snip.update(req.body);
    res.json(snip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// delete
exports.remove = async (req, res) => {
  try {
    const snip = await Snippet.findByPk(req.params.id);
    if (!snip) return res.status(404).json({ message: 'Not found' });
    if (snip.userId !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    await snip.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// fork
exports.fork = async (req, res) => {
  try {
    const original = await Snippet.findByPk(req.params.id);
    if (!original) return res.status(404).json({ message: 'Not found' });
    if (!original.public) return res.status(403).json({ message: 'Private' });

    const copy = await Snippet.create({
      title: original.title + ' (fork)',
      description: original.description,
      language: original.language,
      code: original.code,
      tags: original.tags,
      public: true,
      forkedFromId: original.id,
      userId: req.userId
    });
    res.json(copy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
