// netlify/functions/submit_data.js
const fetch = require('node-fetch'); // Necesitarás instalar node-fetch si Netlify no lo incluye por defecto
                                     // o usar el 'https'/'http' módulo nativo de Node.js

// SCRIPT DE GOOGLE APPS DESPLEGADO
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdwPqB-4sKvwOy-C29MR4n-Ip-Jc-Y5ZIO5Xg0iZ-CV6SqQ7-_JRqC2kpevRH_z_lM/exec';

exports.handler = async function(event, context) {
    // Permitir solicitudes OPTIONS para CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // O tu dominio específico de GitHub Pages
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'Preflight Check Succeeded' })
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
            headers: { 'Allow': 'POST', 'Access-Control-Allow-Origin': '*' }
        };
    }

    try {
        const body = JSON.parse(event.body);
        const participantData = body.participantData;

        if (!participantData || !participantData.id) {
            return { 
                statusCode: 400, 
                body: JSON.stringify({ status: 'error', message: 'Datos incompletos o formato incorrecto.' }),
                headers: { 'Access-Control-Allow-Origin': '*' } 
            };
        }

        // Preparar los datos que el script de Google espera
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
            // strategy_other_description: participantData.finalQuestions?.strategy_other_description,
            trials: participantData.trials // Enviar el array de trials completo
        };

        console.log("Enviando a Google Script:", JSON.stringify(dataForGoogleScript).substring(0, 200) + "..."); // Log truncado

        const googleResponse = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataForGoogleScript),
            // Google Apps Script puede requerir un redirect 'follow' si hace redirecciones internas
            redirect: 'follow' 
        });

        const googleResultText = await googleResponse.text(); // Leer como texto primero
        console.log("Respuesta de Google Script (texto):", googleResultText);
        
        let googleResult;
        try {
            googleResult = JSON.parse(googleResultText); // Intentar parsear como JSON
        } catch (parseError) {
            console.error("Error al parsear respuesta de Google Script como JSON:", parseError);
            console.error("Respuesta de Google Script (completa):", googleResultText);
            // Si no es JSON, podría ser un error HTML de Google o un mensaje de texto simple
            return {
                statusCode: googleResponse.status === 302 ? 200 : 500, // Aceptar redirección 302 como éxito si es el caso
                body: JSON.stringify({ status: 'error_google_script', message: 'Respuesta no JSON de Google Script.', rawResponse: googleResultText.substring(0, 500) }),
                headers: { 'Access-Control-Allow-Origin': '*' }
            };
        }


        if (googleResponse.ok || (googleResponse.status === 302 && googleResult.status === "success")) { // Google Apps Script a veces devuelve 302 en éxito
            console.log("Datos enviados exitosamente a Google Sheets:", googleResult.message);
            return {
                statusCode: 200,
                body: JSON.stringify({ status: 'success', message: 'Datos recibidos y enviados a Google Sheets.' }),
                headers: { 'Access-Control-Allow-Origin': '*' }
            };
        } else {
            console.error("Error al enviar datos a Google Sheets:", googleResult.message || googleResultText);
            return {
                statusCode: 502, // Bad Gateway, error del upstream server
                body: JSON.stringify({ status: 'error_google_sheets', message: googleResult.message || 'Error desconocido de Google Sheets.', rawResponse: googleResultText.substring(0,500) }),
                headers: { 'Access-Control-Allow-Origin': '*' }
            };
        }

    } catch (error) {
        console.error('Error procesando la solicitud en Netlify Function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ status: 'error', message: error.toString() }),
            headers: { 'Access-Control-Allow-Origin': '*' }
        };
    }
};
