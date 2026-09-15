// ============================================================================
// IMPORTS
// ============================================================================
import express from 'express';
import { showHomePage } from './controllers/index.js';

// Import organization controllers (list and details)
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';

// Import project controllers (list and details)
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';

import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// ============================================================================
// ROUTES DEFINITION
// ============================================================================
router.get('/', showHomePage);

// Organization routes
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage); // <-- Missing route!

// Project routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Other routes
router.get('/categories', showCategoriesPage);
router.get('/test-error', testErrorPage);

// ============================================================================
// EXPORTS
// ============================================================================
export default router;