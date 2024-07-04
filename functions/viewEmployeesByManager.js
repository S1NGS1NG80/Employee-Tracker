const pool = require('../db/db');
const cTable = require('console.table');

function viewEmployeesByManager(mainMenu) {
    pool.query(`
        SELECT CONCAT(m.first_name, ' ', m.last_name) AS manager, CONCAT(e.first_name, ' ', e.last_name) AS employee
        FROM employee e
        LEFT JOIN employee m ON e.manager_id = m.id
        ORDER BY manager, employee
    `, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
        }
        mainMenu();
    });
}

module.exports = viewEmployeesByManager;