// Import the needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

// Define constant for the number of projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// ============================================================================
// CONTROLLER FUNCTIONS
// ============================================================================

// Updated function to show only upcoming projects
const showProjectsPage = async (req, res) => {
    // Call the new model function passing the constant
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    // Update the title
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

// New function to show details of a specific project
const showProjectDetailsPage = async (req, res) => {
    // Extract the service project ID from the URL parameters
    const projectId = req.params.id;

    // Retrieve the specific project data
    const project = await getProjectDetails(projectId);

    const title = 'Project Details';

    // Render the new view passing the project data
    res.render('project', { title, project });
};

// ============================================================================
// EXPORTS
// ============================================================================
export { showProjectsPage, showProjectDetailsPage };