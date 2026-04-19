export const CHATBOT_SCOPE_UI = {
    general: {
        title: 'Ámbito general',
        description: 'Este chat ofrece orientación general y ayuda de uso de la plataforma. No responde como si conociera un encargo concreto.',
    },
    contextual: {
        title: 'Ámbito del encargo activo',
        description: 'Este chat está limitado a la hoja de encargo activa y no sustituye asesoramiento legal vinculante.',
    }
} as const;

export const CHATBOT_SCOPE_RESTRICTED_REPLIES = [
    'Esta conversación es general y no está asociada a un encargo concreto. Para responder sobre el estado, documentos o pasos de un caso, abre el asistente desde la hoja de encargo correspondiente.',
    'Solo puedo responder dentro del ámbito del encargo activo. Si necesitas consultar otro caso, abre una conversación desde la hoja de encargo correspondiente.',
    'No puedo emitir asesoramiento legal vinculante ni indicar una estrategia jurídica definitiva. Puedo ofrecer orientación general y ayudarte a revisar la información disponible en la plataforma.',
    'No debo afirmar hechos que no estén disponibles en el contexto actual. Puedo ayudarte con orientación general o con la información visible del encargo activo.',
    'Tu consulta necesita más contexto para responder con seguridad. Si se refiere a un encargo concreto, abre el asistente desde esa hoja de encargo.'
] as const;
