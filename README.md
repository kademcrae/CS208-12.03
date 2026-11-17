# My Simple TODO

An Express, Pug, and MariaDB task planner for CS208. Create tasks, edit their descriptions, mark them completed (or reopen them), and delete them. Blank and whitespace-only descriptions are rejected, and descriptions are limited to the database's 255 characters.

## Set up in GitHub Codespaces

Run the provided installation script once:

```sh
bash setup_scripts/install_db.sh
```

Following the lab transcript, press Enter for the initial root password, decline switching to Unix socket authentication, set the root password to `12345`, and answer yes to removing anonymous users, disallowing remote root login, removing the test database, and reloading privileges. This password is for the local lab database.

Check the service and load the database:

```sh
sudo service mariadb status
mysql -u root -p < setup_scripts/create_demo_table.sql
mysql -u root -p -e 'SHOW DATABASES;'
npm install
npm start
```

Enter `12345` when prompted by MySQL. Open the forwarded port **3000**. On later Codespaces sessions, start MariaDB with `sudo service mariadb start` if needed. The installer uses Ubuntu tools and is intended for Codespaces, not macOS.

The connection in `bin/db.js` uses localhost, user `root`, password `12345`, and database `cs208demo`. Update that file if your local database credentials differ. The SQL script creates the `todos` table with `id`, `task`, and `completed` fields.

## Using the app

- Enter a description and choose **Create Task**.
- Edit a task's description, check or uncheck **Completed**, and choose **Save changes**. The status badge updates after saving.
- Choose **Delete** to remove a task.

## Code guide

`app.js` configures Express, Pug, static files, and database middleware. `routes/index.js` handles listing, creating, updating, and deleting tasks with parameterized SQL. `views/index.pug` renders the task forms, and `public/stylesheets/style.css` provides the responsive styling. `bin/www` starts the server on port 3000 and handles shutdown; `bin/db.js` manages the shared database connection.
