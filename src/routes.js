// ============================================================================
// IMPORTS
// ============================================================================
import express from 'express';
import { showHomePage } from './controllers/index.js';

// Import organization controllers (list and details)
import { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm } from './controllers/organizations.js';

// Import project controllers (list and details)
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';

// Import category controllers (list and details) - COMBINED INTO ONE LINE
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';


const router = express.Router();

// ============================================================================
// ROUTES DEFINITION
// ============================================================================
router.get('/', showHomePage);

// Organization routes
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', processNewOrganizationForm);

// Project routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Category routes
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage); // <-- New route from the assignment


// Other routes
router.get('/test-error', testErrorPage);

// ============================================================================
// EXPORTS
// ============================================================================
export default router;