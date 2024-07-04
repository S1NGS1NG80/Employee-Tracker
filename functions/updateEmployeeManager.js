const pool = require('../db/db');
const inquirer = require('inquirer');

function updateEmployeeManager(mainMenu) {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        const employees = res.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));
        inquirer.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Select the employee to update:',
                choices: employees
            },
            {
                name: 'manager_id',
                type: 'list',
                message: 'Select the new manager:',
                choices: [{ name: 'None', value: null }, ...employees]
            }
        ]).then(answer => {
            pool.query(
                'UPDATE employee SET manager_id = $1 WHERE id = $2',
                [answer.manager_id, answer.employee_id],
                (err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`Updated employee's manager`);
                    }
                    mainMenu();
                }
            );
        });
    });
}


module.exports = updateEmployeeManager;