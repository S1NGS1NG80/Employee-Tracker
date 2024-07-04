const pool = require('../db/db');
const cTable = require('console.table');

function viewEmployeesByDepartment(mainMenu) {
    pool.query(`
        SELECT department.name AS department, CONCAT(employee.first_name, ' ', employee.last_name) AS employee
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        ORDER BY department, employee
    `, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
        }
        mainMenu();
    });
}

module.exports = viewEmployeesByDepartment;