import pool from '../database/index.js'; // Ajuste este caminho se o seu arquivo de conexão com o banco estiver em outro lugar

/* ***************************
 * Get upcoming projects
 * ************************** */
const getUpcomingProjects = async (limit) => {
    const sql = 'SELECT * FROM projects WHERE date >= CURRENT_DATE ORDER BY date ASC LIMIT $1';
    const result = await pool.query(sql, [limit]);
    return result.rows;
};

/* ***************************
 * Get project details
 * ************************** */
const getProjectDetails = async (projectId) => {
    const sql = 'SELECT * FROM projects WHERE id = $1'; // Se a coluna for project_id no seu banco, altere aqui
    const result = await pool.query(sql, [projectId]);
    return result.rows[0];
};

/* ***************************
 * Create a new project
 * ************************** */
const createProject = async (title, description, location, date, organizationId) => {
    const sql = `INSERT INTO projects (title, description, location, date, organization_id) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const result = await pool.query(sql, [title, description, location, date, organizationId]);
    return result.rows[0].id; // Retorna o ID do projeto recém-criado
};

/* ***************************
 * Update an existing project
 * ************************** */
const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const sql = `UPDATE projects 
                 SET title = $1, description = $2, location = $3, date = $4, organization_id = $5 
                 WHERE id = $6 RETURNING *`;
    const result = await pool.query(sql, [title, description, location, date, organizationId, projectId]);
    return result.rows[0];
};

/* ***************************
 * Funções de Voluntariado (Semana 06)
 * ************************** */
const addVolunteer = async (userId, projectId) => {
    const sql = 'INSERT INTO volunteers (user_id, project_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(sql, [userId, projectId]);
    return result.rows[0];
};

const removeVolunteer = async (userId, projectId) => {
    const sql = 'DELETE FROM volunteers WHERE user_id = $1 AND project_id = $2';
    return await pool.query(sql, [userId, projectId]);
};

const checkIfVolunteer = async (userId, projectId) => {
    const sql = 'SELECT * FROM volunteers WHERE user_id = $1 AND project_id = $2';
    const result = await pool.query(sql, [userId, projectId]);
    return result.rowCount > 0; // Retorna true se encontrar o registro, false se não
};

export {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    checkIfVolunteer
};