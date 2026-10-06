import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    checkIfVolunteer
} from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Validation rules for new/edit project
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

// UPDATED (WEEK 06): Check if the user is a volunteer for this project
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);

    let isVolunteer = false;

    // If the user is logged in, check the database to see if they are a volunteer
    if (req.session && req.session.user) {
        // Ensuring the ID is fetched correctly (can be user_id or id depending on the DB return)
        const userId = req.session.user.user_id || req.session.user.id;
        isVolunteer = await checkIfVolunteer(userId, projectId);
    }

    const title = 'Project Details';

    // Pass the isVolunteer variable to the view
    res.render('project', { title, project, categories, isVolunteer });
};

// Render new project form
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';
    res.render('new-project', { title, organizations });
};

// Process new project submission
const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        const newProjectId = await createProject(title, description, location, date, organizationId);
        req.flash('success', 'New service project created successfully!');
        res.redirect('/projects');
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the project.');
        res.redirect('/new-project');
    }
};

// Show edit project form
const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    const title = 'Edit Service Project';

    res.render('edit-project', { title, project, organizations });
};

// Process edit project submission
const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${projectId}`);
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        await updateProject(projectId, title, description, location, date, organizationId);
        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'There was an error updating the project.');
        res.redirect(`/edit-project/${projectId}`);
    }
};

// ============================================================================
// VOLUNTEER CONTROLLERS (WEEK 06)
// ============================================================================

// NEW: Process volunteer registration
const processVolunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id || req.session.user.id;

    try {
        await addVolunteer(userId, projectId);
        // Translated the success flash message as well for consistency
        req.flash('success', 'You have successfully volunteered for this project!');
    } catch (error) {
        console.error('Error volunteering:', error);
        // Translated the error flash message as well for consistency
        req.flash('error', 'There was an error while trying to volunteer.');
    }

    res.redirect(`/project/${projectId}`);
};

// NEW: Process volunteer cancellation
const processUnvolunteerFromProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id || req.session.user.id;

    try {
        await removeVolunteer(userId, projectId);
        // Translated the success flash message as well for consistency
        req.flash('success', 'You have canceled your volunteer registration for this project.');
    } catch (error) {
        console.error('Error removing volunteer:', error);
        // Translated the error flash message as well for consistency
        req.flash('error', 'There was an error while trying to cancel the volunteering.');
    }

    // Check where the request came from. If it came from the dashboard, redirect back there.
    const referer = req.headers.referer || '';
    if (referer.includes('/dashboard')) {
        res.redirect('/dashboard');
    } else {
        res.redirect(`/project/${projectId}`);
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation,
    processVolunteerForProject,      
    processUnvolunteerFromProject   
};