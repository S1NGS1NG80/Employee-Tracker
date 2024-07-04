const pool = require('../db/db');
const inquirer = require('inquirer');

function updateEmployeeRole(mainMenu) {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        const employees = res.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));
        pool.query('SELECT * FROM role', (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            const roles = res.rows.map(row => ({ name: row.title, value: row.id }));
            inquirer.prompt([
                {
                    name: 'employee_id',
                    type: 'list',
                    message: 'Select the employee to update:',
                    choices: employees
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the new role:',
                    choices: roles
                }
            ]).then(answer => {
                pool.query(
                    'UPDATE employee SET role_id = $1 WHERE id = $2',
                    [answer.role_id, answer.employee_id],
                    (err, res) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(`Updated employee's role`);
                        }
                        mainMenu();
                    }
                );
            });
        });
    });
}


module.exports = updateEmployeeRole;