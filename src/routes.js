// ============================================================================
// IMPORTS
// ============================================================================
import express from 'express';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { showOrganizationDetailsPage } from './controllers/organizations.js';


const router = express.Router();

// ============================================================================
// ROUTES DEFINITION
// ============================================================================
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/organization/:id', showOrganizationDetailsPage);


// Error-handling test route
router.get('/test-error', testErrorPage);

// ============================================================================
// EXPORTS
// ============================================================================
export default router;