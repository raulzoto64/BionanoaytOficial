-- SCRIPT PARA INSERTAR 5 FORMULARIOS DINÁMICOS INICIALES
-- Ejecuta esto en el editor SQL de tu Supabase Dashboard

INSERT INTO public.forms (name, title, subtitle, description, image_url, fields, is_active)
VALUES 
-- 1. FORMULARIO DE CONTACTO GENERAL
(
    'Contacto General', 
    '¿En qué podemos ayudarte?', 
    'Escríbenos y un especialista te contactará.', 
    'Nuestro equipo técnico está listo para resolver tus dudas sobre bionanotecnología aplicada.',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    '[
        {"id": "f1", "label": "Nombre Completo", "name": "name", "type": "text", "required": true, "placeholder": "Tu nombre..."},
        {"id": "f2", "label": "Correo Electrónico", "name": "email", "type": "email", "required": true, "placeholder": "tu@email.com"},
        {"id": "f3", "label": "Mensaje", "name": "message", "type": "textarea", "required": true, "placeholder": "¿Cómo podemos ayudarte?"}
    ]'::jsonb,
    true
),

-- 2. SOLICITUD DE COTIZACIÓN
(
    'Solicitud de Cotización', 
    'Solicita tu Presupuesto', 
    'Recibe una propuesta personalizada para tu proyecto.', 
    'Analizamos tus necesidades técnicas para ofrecerte la mejor solución costo-beneficio.',
    'https://images.unsplash.com/photo-1454165833222-38bd0150da23?auto=format&fit=crop&q=80&w=800',
    '[
        {"id": "q1", "label": "Nombre del Contacto", "name": "name", "type": "text", "required": true},
        {"id": "q2", "label": "Empresa / Entidad", "name": "company", "type": "text", "required": true},
        {"id": "q3", "label": "Email Corporativo", "name": "email", "type": "email", "required": true},
        {"id": "q4", "label": "Producto de Interés", "name": "product", "type": "select", "required": true, "options": ["Equipamiento Laboratorio", "Bio-insumos", "Consultoría Técnica", "Otros"]},
        {"id": "q5", "label": "Descripción del Proyecto", "name": "description", "type": "textarea", "required": true}
    ]'::jsonb,
    true
),

-- 3. DESCARGA DE INFORME TÉCNICO
(
    'Lead Magnet: Informe Técnico', 
    'Descarga nuestro Informe 2024', 
    'Tendencias en Bionanotecnología para tratamiento de aguas.', 
    'Accede gratis a nuestra investigación exclusiva sobre el impacto de la bionanociencia en la industria.',
    'https://images.unsplash.com/photo-1532187875605-2fe3587b1ee0?auto=format&fit=crop&q=80&w=800',
    '[
        {"id": "lm1", "label": "Tu Nombre", "name": "name", "type": "text", "required": true},
        {"id": "lm2", "label": "Email de Envío", "name": "email", "type": "email", "required": true},
        {"id": "lm3", "label": "Acepto recibir comunicaciones técnicas", "name": "newsletter", "type": "checkbox", "required": true}
    ]'::jsonb,
    true
),

-- 4. AGENDAR CONSULTORÍA ELITE
(
    'Agendar Consultoría', 
    'Habla con un Experto', 
    'Sesión de 15 minutos para diagnóstico técnico.', 
    'Agenda un espacio directamente con nuestros ingenieros para revisar tu caso particular.',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
    '[
        {"id": "c1", "label": "Nombre Completo", "name": "name", "type": "text", "required": true},
        {"id": "c2", "label": "WhatsApp de Contacto", "name": "phone", "type": "tel", "required": true},
        {"id": "c3", "label": "País / Ubicación", "name": "country", "type": "text", "required": true},
        {"id": "c4", "label": "Día Preferido", "name": "preferred_day", "type": "select", "required": true, "options": ["Lunes a Miércoles", "Jueves a Viernes"]},
        {"id": "c5", "label": "Resumen del Desafío", "name": "challenge", "type": "textarea", "required": false}
    ]'::jsonb,
    true
),

-- 5. UNIRSE AL ECOSISTEMA
(
    'Registro Ecosistema', 
    'Únete a Bionano A&T', 
    'Forma parte de nuestra red de aliados estratégicos.', 
    'Si eres científico, distribuidor o proveedor, queremos conocerte para potenciar la industria.',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    '[
        {"id": "e1", "label": "Nombre / Razón Social", "name": "name", "type": "text", "required": true},
        {"id": "e2", "label": "Perfil Profesional", "name": "profile", "type": "select", "required": true, "options": ["Científico/Investigador", "Distribuidor", "Inversionista", "Proveedor"]},
        {"id": "e3", "label": "Ciudad/Sede", "name": "location", "type": "text", "required": true},
        {"id": "e4", "label": "Email", "name": "email", "type": "email", "required": true},
        {"id": "e5", "label": "¿Por qué quieres unirte?", "name": "motivation", "type": "textarea", "required": true}
    ]'::jsonb,
    true
);
