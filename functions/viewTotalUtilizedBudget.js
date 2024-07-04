const pool = require('../db/db');
const cTable = require('console.table');

function viewTotalUtilizedBudget(mainMenu) {
    pool.query(`
        SELECT department.name AS department, SUM(role.salary) AS utilized_budget
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        GROUP BY department.name
    `, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
        }
        mainMenu();
    });
}

module.exports = viewTotalUtilizedBudget;