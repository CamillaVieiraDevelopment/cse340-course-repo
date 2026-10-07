import db from './db.js'

/* ***************************
 * PROJECT READ AND CREATE OPERATIONS
 * ************************** */

const getProjectsByOrganizationId = async (organizationId) => {
    const query = 'SELECT * FROM public.service_project WHERE organization_id = $1 ORDER BY date ASC';
    const result = await db.query(query, [organizationId]);
    return result.rows;
};

const getUpcomingProjects = async (limit) => {
    const query = 'SELECT * FROM public.service_project WHERE date >= CURRENT_DATE ORDER BY date ASC LIMIT $1';
    const result = await db.query(query, [limit]);
    return result.rows;
};

const getProjectDetails = async (projectId) => {
    const query = 'SELECT * FROM public.service_project WHERE project_id = $1';
    const result = await db.query(query, [projectId]);
    return result.rows[0];
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `INSERT INTO public.service_project (title, description, location, date, organization_id) 
                   VALUES ($1, $2, $3, $4, $5) RETURNING project_id`;
    const result = await db.query(query, [title, description, location, date, organizationId]);
    return result.rows[0].project_id;
};

/* ***************************
 * PROJECT UPDATE OPERATION
 * ************************** */
const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `UPDATE public.service_project 
                   SET title = $1, description = $2, location = $3, date = $4, organization_id = $5 
                   WHERE project_id = $6 
                   RETURNING project_id;`;

    const queryParams = [title, description, location, date, organizationId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update project. Project not found.');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

/* ***************************
 * VOLUNTEER MANAGEMENT OPERATIONS
 * ************************** */
const addVolunteer = async (userId, projectId) => {
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

// Retrieve projects associated with a specific volunteer
const getVolunteeredProjects = async (userId) => {
    const query = `
        SELECT p.* 
        FROM public.service_project p
        JOIN volunteers v ON p.project_id = v.project_id
        WHERE v.user_id = $1
        ORDER BY p.date ASC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

// Module Exports
export {
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    checkIfVolunteer,
    getVolunteeredProjects
};