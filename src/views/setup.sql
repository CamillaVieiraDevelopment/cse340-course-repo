-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Create Tables
-- ========================================

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);


-- ========================================
-- Population Tables
-- ========================================

INSERT INTO service_project (organization_id, title, description, location, date) VALUES
-- 5 Projects for Bright Future Builders (ID 1)
(1, 'Community Center Renovation', 'Repairing the roof and painting the walls of the local community center.', '123 Main St', '2026-10-15'),
(1, 'Park Playground Rebuild', 'Installing new, safe playground equipment.', 'City Park', '2026-10-22'),
(1, 'Library Accessibility Ramp', 'Building a wheelchair ramp for the downtown library.', 'Downtown Library', '2026-11-05'),
(1, 'Homeless Shelter Plumbing Fix', 'Upgrading the plumbing system in the local shelter.', 'Hope Shelter', '2026-11-12'),
(1, 'Neighborhood Sidewalk Repair', 'Fixing broken concrete along Maple Street to improve pedestrian safety.', 'Maple Street', '2026-11-20'),

-- 5 Projects for GreenHarvest Growers (ID 2)
(2, 'Downtown Community Garden Setup', 'Building raised garden beds and planting autumn vegetables.', '456 Urban Ave', '2026-10-18'),
(2, 'Composting Workshop', 'Teaching locals how to start and maintain a compost bin.', 'GreenSquare', '2026-10-25'),
(2, 'School Seedling Planting', 'Helping elementary students plant native trees around the school.', 'Lincoln Elementary', '2026-11-02'),
(2, 'Harvest Festival Food Drive', 'Collecting and distributing fresh produce to families in need.', 'Central Plaza', '2026-11-15'),
(2, 'Winter Crop Prep', 'Preparing the soil and planting winter-hardy crops.', 'Northside Farm', '2026-11-22'),

-- 5 Projects for UnityServe Volunteers (ID 3)
(3, 'Soup Kitchen Assistance', 'Serving meals and organizing the pantry.', 'Grace Soup Kitchen', '2026-10-20'),
(3, 'Senior Center Game Night', 'Hosting a bingo and board game night for local seniors.', 'Sunset Senior Living', '2026-10-27'),
(3, 'River Cleanup', 'Picking up trash and debris along the riverbank.', 'Riverfront Park', '2026-11-08'),
(3, 'Animal Shelter Dog Walking', 'Walking dogs and cleaning kennels at the county shelter.', 'County Animal Rescue', '2026-11-18'),
(3, 'Holiday Toy Drive Sorting', 'Sorting and wrapping donated toys for children.', 'Community Hall', '2026-12-05');

-- ========================================
-- Create Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- =============================================================================
-- Create Join Table for conect projects and categories - Structural Correction
-- =============================================================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES service_project(project_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- =============================================================================
-- Population data - Join Table for conect projects and categories
-- =============================================================================

-- Insert 3 relevant categories for service projects
INSERT INTO category (name) VALUES 
('Environment & Sustainability'),
('Community & Infrastructure'),
('Education & Support');

-- Associate the 15 previously created projects with categories
-- The format is (project_id, category_id)
INSERT INTO project_category (project_id, category_id) VALUES 
-- Bright Future Builders projects (Focused on Infrastructure/Community -> ID 2)
(1, 2), (2, 2), (3, 2), (4, 2), (5, 2),

-- GreenHarvest Growers projects (Focused on Environment -> ID 1, and some on Education -> ID 3)
(6, 1), (7, 1), (8, 1), (8, 3), (9, 2), (10, 1),

-- UnityServe Volunteers projects (Focused on Support/Community -> ID 2, Education -> ID 3, Environment -> ID 1)
(11, 2), (12, 2), (13, 1), (14, 2), (15, 3);