// ATENÇÃO: Verifique o nome do arquivo do seu banco de dados na pasta database.
// Se for db.js, altere de 'index.js' para 'db.js' na linha abaixo.
import db from '../database/index.js';

/* ***************************
 * MANTENHA AQUI SUAS FUNÇÕES ANTIGAS
 * Cole aqui o corpo das funções:
 * - getProjectsByOrganizationId
 * - getUpcomingProjects
 * - getProjectDetails
 * - createProject
 * ************************** */

// Função restaurada exatamente como no seu commit de 26/10
const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `UPDATE public.service_project 
                   SET title = $1, description = $2, location = $3, date = $4, organization_id = $5 
                   WHERE project_id = $6 
                   RETURNING project_id;`; //[cite: 6]

    const queryParams = [title, description, location, date, organizationId, projectId]; //[cite: 6]
    const result = await db.query(query, queryParams); //[cite: 6]

    if (result.rows.length === 0) { //[cite: 6]
        throw new Error('Failed to update project. Project not found.'); //[cite: 6]
    } //[cite: 6]

    if (process.env.ENABLE_SQL_LOGGING === 'true') { //[cite: 6]
        console.log('Updated project with ID:', result.rows[0].project_id); //[cite: 6]
    } //[cite: 6]

    return result.rows[0].project_id; //[cite: 6]
};

/* ***************************
 * NOVAS FUNÇÕES DA SEMANA 06
 * Adaptadas para usar db.query e project_id
 * ************************** */
const addVolunteer = async (userId, projectId) => {
    // Verifique se a sua tabela se chama 'volunteers' e as colunas 'user_id' e 'project_id'
    const sql = 'INSERT INTO volunteers (user_id, project_id) VALUES ($1, $2) RETURNING *';
    const result = await db.query(sql, [userId, projectId]);
    return result.rows[0];
};

const removeVolunteer = async (userId, projectId) => {
    const sql = 'DELETE FROM volunteers WHERE user_id = $1 AND project_id = $2';
    return await db.query(sql, [userId, projectId]);
};

const checkIfVolunteer = async (userId, projectId) => {
    const sql = 'SELECT * FROM volunteers WHERE user_id = $1 AND project_id = $2';
    const result = await db.query(sql, [userId, projectId]);
    return result.rowCount > 0;
};

// Exportando tanto as funções do commit quanto as novas da semana 06
export {
    getProjectsByOrganizationId, //[cite: 7]
    getUpcomingProjects,         //[cite: 7]
    getProjectDetails,           //[cite: 7]
    createProject,               //[cite: 7]
    updateProject,               //[cite: 7]
    addVolunteer,
    removeVolunteer,
    checkIfVolunteer
};