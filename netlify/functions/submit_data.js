// netlify/functions/submit_data.js
const fetch = require('node-fetch'); // Necesitarás instalar node-fetch si Netlify no lo incluye por defecto
                                     // o usar el 'https'/'http' módulo nativo de Node.js

// SCRIPT DE GOOGLE APPS DESPLEGADO
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdwPqB-4sKvwOy-C29MR4n-Ip-Jc-Y5ZIO5Xg0iZ-CV6SqQ7-_JRqC2kpevRH_z_lM/exec';

// Origen permitido. Para producción, usa tu URL específica de GitHub Pages.
const ALLOWED_ORIGIN = 'https://hugoprogramador.github.io'; 
// const ALLOWED_ORIGIN = '*'; // Para pruebas amplias, pero menos seguro

exports.handler = async function(event, context) {
    // Cabeceras CORS comunes
    const corsHeaders = {
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'POST, OPTIONS', // OPTIONS es crucial para preflight
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Manejar la solicitud OPTIONS (preflight)
    if (event.httpMethod === 'OPTIONS') {
        console.log("Respondiendo a solicitud OPTIONS (preflight)");
        return {
            statusCode: 204, // No Content - Estándar para preflight exitoso
            headers: corsHeaders,
            body: '' // El cuerpo no es necesario para OPTIONS
        };
    }

    // Procesar solo solicitudes POST
    if (event.httpMethod !== 'POST') {
        console.log(`Método no permitido: ${event.httpMethod}`);
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
            headers: { ...corsHeaders, 'Allow': 'POST, OPTIONS' } // Incluir Allow
        };
    }

    // Si llegamos aquí, es una solicitud POST
    try {
        const body = JSON.parse(event.body);
        const participantData = body.participantData;

        if (!participantData || !participantData.id) {
            console.error("Datos POST incompletos o formato incorrecto.");
            return { 
                statusCode: 400, 
                body: JSON.stringify({ status: 'error', message: 'Datos incompletos o formato incorrecto.' }),
                headers: corsHeaders // Añadir cabeceras CORS también a respuestas de error
            };
        }

        const participant_id = participantData.id || 'desconocido';
        console.log(`Procesando POST para P${participant_id}`);

        // ... (tu lógica para preparar dataForGoogleScript)
        const dataForGoogleScript = {
            participant_id: participantData.id,
            group: participantData.group,
            age: participantData.demographics?.age,
            education: participantData.demographics?.education,
            occupation: participantData.demographics?.occupation,
            state_origin: participantData.demographics?.stateOrigin,
            marital_status: participantData.demographics?.maritalStatus,
            foundCategories: participantData.finalQuestions?.foundCategories,
            mostFoundCategories: participantData.finalQuestions?.mostFoundCategories,
            difficultyOverall: participantData.finalQuestions?.difficultyOverall,
            strategy_used: participantData.finalQuestions?.strategy_used,
            trials: participantData.trials
        };
        
        console.log("Enviando a Google Script:", JSON.stringify(dataForGoogleScript).substring(0, 100) + "...");

        const googleResponse = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataForGoogleScript),
            redirect: 'follow' 
        });

        const googleResultText = await googleResponse.text();
        console.log("Respuesta de Google Script (status):", googleResponse.status);
        console.log("Respuesta de Google Script (texto):", googleResultText.substring(0,300) + "...");
        
        let googleResult;
        try {
            googleResult = JSON.parse(googleResultText);
        } catch (parseError) {
            console.error("Error al parsear respuesta de Google Script:", parseError, "Respuesta cruda:", googleResultText);
            return {
                statusCode: 502, // Bad Gateway (problema con el servidor upstream)
                body: JSON.stringify({ status: 'error_google_script_parse', message: 'Respuesta no JSON de Google Script.', rawResponse: googleResultText.substring(0,500) }),
                headers: corsHeaders
            };
        }

        // Google Apps Script con ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON)
        // debería devolver 200 OK. El redirect 302 es más común si no se configura el MimeType correctamente.
        if (googleResponse.ok && googleResult.status === "success") {
             console.log("Datos enviados exitosamente a Google Sheets:", googleResult.message);
            return {
                statusCode: 200,
                body: JSON.stringify({ status: 'success', message: 'Datos recibidos y enviados a Google Sheets.' }),
                headers: corsHeaders
            };
        } else {
            console.error("Error reportado por Google Sheets o respuesta inesperada:", googleResult.message || googleResultText);
            return {
                statusCode: googleResponse.status !== 200 ? googleResponse.status : 502, 
                body: JSON.stringify({ status: 'error_google_sheets_api', message: googleResult.message || 'Error desconocido de Google Sheets API.', rawResponse: googleResultText.substring(0,500) }),
                headers: corsHeaders
            };
        }

    } catch (error) {
        console.error('Error general procesando la solicitud en Netlify Function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ status: 'error_netlify_function', message: error.toString() }),
            headers: corsHeaders
        };
    }
};
