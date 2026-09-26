import db from './db.js';

// Original function
const getAllCategories = async () => {
    const query = 'SELECT * FROM public.category ORDER BY name';
    const result = await db.query(query);
    return result.rows;
};

// NEW: Retrieve a single category by its ID
const getCategoryDetails = async (id) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// NEW: Retrieve all service projects for a given category
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.date, 
            p.location, 
            o.name AS organization_name,
            o.organization_id
        FROM public.service_project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        JOIN public.project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date ASC;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

// NEW: Retrieve all categories for a given service project
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.category c
        JOIN public.project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

// NEW: Assign a single category to a project
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;
    await db.query(query, [categoryId, projectId]);
};

// NEW: Update all category assignments for a project
const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

// Export all functions
export {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments
};