var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
  try {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }
      res.render('index', { title: 'My Simple TODO', todos: results });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

router.post('/create', function (req, res, next) {
    const task = typeof req.body.task === 'string' ? req.body.task.trim() : '';
    if (!task || task.length > 255) {
      return res.status(400).send('Task must contain between 1 and 255 characters.');
    }
    try {
      req.db.query('INSERT INTO todos (task) VALUES (?);', [task], (err, results) => {
        if (err) {
          console.error('Error adding todo:', err);
          return res.status(500).send('Error adding todo');
        }
        console.log('Todo added successfully:', results);
        // Redirect to the home page after adding
        res.redirect('/');
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      res.status(500).send('Error adding todo');
    }
});

// Save the description and completion state together.
router.post('/update', function (req, res, next) {
  const task = typeof req.body.task === 'string' ? req.body.task.trim() : '';
  const id = Number(req.body.id);
  const completed = req.body.completed === '1' ? 1 : 0;

  if (!task || task.length > 255) {
    return res.status(400).send('Task must contain between 1 and 255 characters.');
  }
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).send('Invalid task ID.');
  }

  req.db.query(
    'UPDATE todos SET task = ?, completed = ? WHERE id = ?;',
    [task, completed, id],
    (err, results) => {
      if (err) return next(err);
      if (results.affectedRows === 0) {
        return res.status(404).send('Task not found.');
      }
      res.redirect('/');
    }
  );
});

router.post('/delete', function (req, res, next) {
    const { id } = req.body;
    try {
      req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error deleting todo:', err);
          return res.status(500).send('Error deleting todo');
        }
        console.log('Todo deleted successfully:', results);
        // Redirect to the home page after deletion
        res.redirect('/');
    });
    }catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Error deleting todo:');
    }
});

module.exports = router;