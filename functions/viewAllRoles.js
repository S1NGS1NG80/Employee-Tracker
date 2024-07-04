const pool = require('../db/db');


function viewAllRoles(mainMenu) {
    pool.query(`
        SELECT role.id, role.title, department.name AS department, role.salary 
        FROM role
        JOIN department ON role.department_id = department.id
    `, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
        }
        mainMenu();
    });
}

module.exports = viewAllRoles;