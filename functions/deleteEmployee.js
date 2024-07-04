const pool = require('../db/db');
const cTable = require('console.table');
const inquirer = require('inquirer');

function deleteEmployee(mainMenu) {
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
                message: 'Select the employee to delete:',
                choices: employees
            }
        ]).then(answer => {
            pool.query('DELETE FROM employee WHERE id = $1', [answer.employee_id], (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Deleted employee`);
                }
                mainMenu();
            });
        });
    });
}
module.exports = deleteEmployee;
