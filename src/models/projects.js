import db from './db.js';

// ============================================================================
// MODEL FUNCTIONS
// ============================================================================

// Original function (kept for backward compatibility if needed)
const getAllProjects = async () => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.location, 
            p.date, 
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id;
    `;
    const result = await db.query(query);
    return result.rows;
};

// Function from the previous learning activity
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM public.service_project
        WHERE organization_id = $1
        ORDER BY date;
      `;
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

// NEW: Get upcoming projects limited by a specific number
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.date, 
            p.location, 
            p.organization_id, 
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;
    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);
    return result.rows;
};

// NEW: Get details for a single project by its ID
const getProjectDetails = async (id) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.date, 
            p.location, 
            p.organization_id, 
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const queryParams = [id];
    const result = await db.query(query, queryParams);

    // Return the single project object
    return result.rows.length > 0 ? result.rows[0] : null;
};

// NEW: Create a new service project
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO public.service_project (title, description, location, date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;
    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

// NEW: Update an existing service project
const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE public.service_project
        SET title = $1, description = $2, location = $3, date = $4, organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;
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

// ============================================================================
// VOLUNTEER FUNCTIONS (SEMANA 06)
// ============================================================================

// Add a user as a volunteer in a project
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING; -- Evita erro se ele já for voluntário
    `;
    await db.query(query, [userId, projectId]);
};

// Removing a user from a volunteer project
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2;
    `;
    await db.query(query, [userId, projectId]);
};

// Check if a user is already a volunteer in a specific project.
const checkIfVolunteer = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0; // Retorna true se encontrou, false se não
};

// Retrieve the list of projects the user has volunteered for (to the Dashboard)
const getVolunteeredProjects = async (userId) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.date, 
            p.location, 
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        JOIN project_volunteers pv ON p.project_id = pv.project_id
        WHERE pv.user_id = $1
        ORDER BY p.date ASC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

// ============================================================================
// EXPORTS
// ============================================================================
export {
    getAllProjects,
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