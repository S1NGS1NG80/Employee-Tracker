const pool = require('../db/db');
const inquirer = require('inquirer');

function deleteRole(mainMenu) {
    pool.query('SELECT * FROM role', (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        const roles = res.rows.map(row => ({ name: row.title, value: row.id }));
        inquirer.prompt([
            {
                name: 'role_id',
                type: 'list',
                message: 'Select the role to delete:',
                choices: roles
            }
        ]).then(answer => {
            pool.query('DELETE FROM role WHERE id = $1', [answer.role_id], (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Deleted role`);
                }
                mainMenu();
            });
        });
    });
}

module.exports = deleteRole;