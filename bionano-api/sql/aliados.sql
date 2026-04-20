-- SCRIPT DE MIGRACIÓN: ECOISTEMA Y RED DE ALIADOS
-- Bionano A&T - Todos los datos en un solo archivo

-- 1. Estructura de Tablas (Si no existen)
CREATE TABLE IF NOT EXISTS `ecosystem_members` (
  `id` VARCHAR(50) PRIMARY KEY,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `status` ENUM('active', 'draft', 'inactive') DEFAULT 'active',
  `image` TEXT,
  `sector` VARCHAR(100),
  `social_media` JSON,
  `youtube_videos` JSON,
  `short_videos` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ecosystem_member_translations` (
  `member_id` VARCHAR(50),
  `language` CHAR(2),
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT,
  PRIMARY KEY (`member_id`, `language`),
  FOREIGN KEY (`member_id`) REFERENCES `ecosystem_members`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Insertar/Reemplazar datos de Miembros
REPLACE INTO `ecosystem_members` (`id`, `slug`, `status`, `image`, `sector`, `social_media`, `youtube_videos`, `short_videos`) VALUES
('eco-001', 'ce3pac', 'active', 'https://ik.imagekit.io/9vntw05bmz/productos/imagenes/product_user_default_1776711247343_auvryghv7.webp', 'Empaques Alimentarios', '{}', '[]', '[]'),
('eco-002', 'coatings-sas', 'active', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=400', 'Química Sostenible', '{}', '[]', '[]'),
('eco-003', 'vmax-brasil', 'active', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400', 'Logística y Distribución', '{}', '[]', '[]'),
('eco-004', 'agrosavia', 'active', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&h=200&fit=crop', 'Investigación Agrícola', '{"website": "https://www.agrosavia.co"}', '[]', '[]'),
('eco-005', 'procolombia', 'active', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop', 'Promoción Internacional', '{"website": "https://www.procolombia.co"}', '[]', '[]'),
('eco-006', 'minciencias', 'active', 'https://ik.imagekit.io/wfm4vebzr/perfiles/avatares/avatar_user_default_1775966374482_895o48o2e.webp', 'Ciencia & Innovación', '{"website": "https://minciencias.gov.co"}', '[]', '[]'),
('eco-007', 'biotrade', 'active', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&h=200&fit=crop', 'Comercio Verde', '{}', '[]', '[]'),
('eco-008', 'agronet', 'active', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=400&h=200&fit=crop', 'Red Agrícola', '{}', '[]', '[]'),
('eco-009', 'ecoinvest', 'active', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop', 'Inversión Verde', '{}', '[]', '[]');

-- 3. Traducciones en Español
REPLACE INTO `ecosystem_member_translations` (`member_id`, `language`, `name`, `description`) VALUES
('eco-001', 'es', 'CE3PAC', 'Trabajan con empaques para almacenamiento de huevos y productos de panadería. Incorporan nuestro biocida para control de hongos y bacterias en empaques de contacto alimentario.'),
('eco-002', 'es', 'Coatings S.A.S', 'Líder en recubrimientos industriales que incorporan nanotecnología BNX para la protección de superficies metálicas y plásticas contra la corrosión biológica.'),
('eco-003', 'es', 'Vmax (Brasil)', 'Distribuidor aliado en Brasil con más de 20 años en el sector de polímeros para empaques de alimentos. Nuestro canal de entrada al mercado brasilero.'),
('eco-004', 'es', 'AGROSAVIA', 'Corporación colombiana de investigación agropecuaria. Aliado estratégico en la validación de soluciones bionanotecnológicas para el sector agrícola nacional.'),
('eco-005', 'es', 'ProColombia', 'Entidad gubernamental encargada de promover las exportaciones colombianas. Apoyo fundamental en nuestra expansión a mercados internacionales.'),
('eco-006', 'es', 'MinCiencias', 'Ministerio de Ciencias de Colombia. Respalda nuestra innovación tecnológica a través de convocatorias de I+D+i y beneficios tributarios por ciencia.'),
('eco-007', 'es', 'BioTrade', 'Red de comercio sostenible que certifica productos de origen biológico para mercados premium europeos y norteamericanos.'),
('eco-008', 'es', 'AgroNet', 'Plataforma integral de conexión agrícola que facilita el acceso de miles de pequeños productores a las tecnologías de Bionano A&T.'),
('eco-009', 'es', 'EcoInvest', 'Fondo de inversión de impacto enfocado en acelerar empresas de biotecnología que promueven la economía circular y la sostenibilidad.');

-- 4. Traducciones en Inglés
REPLACE INTO `ecosystem_member_translations` (`member_id`, `language`, `name`, `description`) VALUES
('eco-001', 'en', 'CE3PAC', 'They work with packaging for egg storage and bakery products. They incorporate our biocide for fungi and bacteria control in food-contact packaging.'),
('eco-002', 'en', 'Coatings S.A.S', 'Leader in industrial coatings incorporating BNX nanotechnology for the protection of metal and plastic surfaces against biological corrosion.'),
('eco-003', 'en', 'Vmax (Brazil)', 'Allied distributor in Brazil with over 20 years in the food packaging polymers sector. Our gateway to the Brazilian market.'),
('eco-004', 'en', 'AGROSAVIA', 'Colombian corporation for agricultural research. Strategic ally in validating bionanotechnological solutions for the national agricultural sector.'),
('eco-005', 'en', 'ProColombia', 'Government entity in charge of promoting Colombian exports. Fundamental support in our expansion to international markets.'),
('eco-006', 'en', 'MinCiencias', 'Ministry of Science. Supports our technological innovation through R&D calls and tax benefits for science.'),
('eco-007', 'en', 'BioTrade', 'Sustainable trade network that certifies biological origin products for European and North American premium markets.'),
('eco-008', 'en', 'AgroNet', 'Comprehensive agricultural connection platform that facilitates access for thousands of small producers to Bionano A&T technologies.'),
('eco-009', 'en', 'EcoInvest', 'Impact investment fund focused on accelerating biotechnology companies promoting circular economy and sustainability.');
