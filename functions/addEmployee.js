const pool = require('../db/db');
const inquirer = require('inquirer');

function addEmployee(mainMenu) {
    pool.query('SELECT * FROM role', (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        const roles = res.rows.map(row => ({ name: row.title, value: row.id }));
        pool.query('SELECT * FROM employee', (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            const managers = res.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));
            managers.unshift({ name: 'None', value: null });
            inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'Enter the employee\'s first name:'
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Enter the employee\'s last name:'
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the employee\'s role:',
                    choices: roles
                },
                {
                    name: 'manager_id',
                    type: 'list',
                    message: 'Select the employee\'s manager:',
                    choices: managers
                }
            ]).then(answer => {
                pool.query(
                    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
                    [answer.first_name, answer.last_name, answer.role_id, answer.manager_id],
                    (err, res) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(`Added employee ${answer.first_name} ${answer.last_name}`);
                        }
                        mainMenu();
                    }
                );
            });
        });
    });
}

module.exports = addEmployee;