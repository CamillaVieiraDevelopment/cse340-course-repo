import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
// Import the new model function to get categories
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

// UPDATED: Now fetches category tags
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    // NEW: Fetch categories for this specific project
    const categories = await getCategoriesByProjectId(projectId);

    const title = 'Project Details';

    // Pass 'categories' to the view
    res.render('project', { title, project, categories });
};

export { showProjectsPage, showProjectDetailsPage };