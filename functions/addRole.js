const pool = require('../db/db');
const cTable = require('console.table');
const inquirer = require('inquirer');

function addRole(mainMenu) {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        const departments = res.rows.map(row => ({ name: row.name, value: row.id }));
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the role title:'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the role salary:'
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department:',
                choices: departments
            }
        ]).then(answer => {
            pool.query(
                'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
                [answer.title, answer.salary, answer.department_id],
                (err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`Added role ${answer.title}`);
                    }
                    mainMenu();
                }
            );
        });
    });
}

module.exports = addRole;