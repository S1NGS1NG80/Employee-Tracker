const pool = require('../db/db');
const inquirer = require('inquirer');

function deleteDepartment(mainMenu) {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        const departments = res.rows.map(row => ({ name: row.name, value: row.id }));
        inquirer.prompt([
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department to delete:',
                choices: departments
            }
        ]).then(answer => {
            pool.query('DELETE FROM department WHERE id = $1', [answer.department_id], (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Deleted department`);
                }
                mainMenu();
            });
        });
    });
}

module.exports = deleteDepartment;