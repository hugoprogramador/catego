from flask import Flask, request, jsonify, render_template, send_from_directory
import csv
import os
import datetime
import json # Para parsear el JSON del cliente

app = Flask(__name__, static_folder='static', template_folder='templates')

# Directorio para guardar los datos
DATA_DIR = "datos_recibidos"
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# Ruta para servir el archivo index.html principal
@app.route('/')
def index():
    return render_template('index.html')

# Ruta para servir archivos estáticos (JS, CSS, imágenes)
# Flask lo hace automáticamente si están en la carpeta 'static'
# pero podemos definir una ruta explícita si es necesario para subcarpetas.
@app.route('/Users/hugo/Documents/categorizacion-main-main/static')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)


# Endpoint para recibir los datos del experimento
@app.route('/submit_data', methods=['POST'])
def submit_data():
    try:
        data = request.get_json() # Obtener los datos JSON enviados por el cliente
        
        if not data or 'participantData' not in data:
            return jsonify({"status": "error", "message": "Datos incompletos o formato incorrecto."}), 400

        participant_data = data['participantData']
        participant_id = participant_data.get('id', ' desconocido')
        group = participant_data.get('group', 'desconocido')

        # Crear un nombre de archivo único (o podrías usar el ID del participante)
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"experiment_data_P{participant_id}_G{group}_{timestamp}.csv"
        filepath = os.path.join(DATA_DIR, filename)

        # Escribir los datos en el CSV (lógica similar a tu downloadDataAsCSV en JS)
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            # Sección de información del participante
            participant_writer = csv.writer(csvfile)
            p_headers = ["participant_id", "group", "age", "education", "occupation", "state_origin", "marital_status"]
            participant_writer.writerow(p_headers)
            demographics = participant_data.get('demographics', {})
            p_row = [
                participant_data.get('id'), participant_data.get('group'), demographics.get('age'),
                demographics.get('education'), demographics.get('occupation'),
                demographics.get('stateOrigin'), demographics.get('maritalStatus')
            ]
            participant_writer.writerow(p_row)
            csvfile.write("\n") # Línea vacía

            # Sección de preguntas finales
            final_questions = participant_data.get('finalQuestions', {})
            if final_questions:
                fq_headers = list(final_questions.keys())
                participant_writer.writerow(fq_headers)
                fq_row = [final_questions.get(h, '') for h in fq_headers]
                participant_writer.writerow(fq_row)
                csvfile.write("\n")


            # Sección de datos de ensayos y acciones
            trial_action_headers = [
                "participant_id", "trial_number", "rule_type", 
                "rule_param_shape", "rule_param_color", "rule_param_fill", 
                "rule_param_feature", "rule_param_value", 
                "rule_param_feature1", "rule_param_value1", "rule_param_feature2", "rule_param_value2", 
                "rule_param_subtype", "grid_configuration_ids",
                "action_sequence_in_trial", "action_type", "action_time_ms", 
                "selected_item_index", "selected_item_id", "selected_item_shape", "selected_item_color", "selected_item_fill",
                "tested_selection_ids", "is_test_any_item_relevant", 
                "final_selection_ids", "is_final_selection_correct", "confidence",
                "trial_start_time_ms", "trial_end_time_ms", "trial_correctly_solved"
            ]
            trial_writer = csv.writer(csvfile)
            trial_writer.writerow(trial_action_headers)

            trials = participant_data.get('trials', [])
            for trial in trials:
                if not trial.get('actions'): # Si no hay acciones, escribir solo info del trial
                    row = [
                        participant_data.get('id'), trial.get('trialNumber'), trial.get('ruleType'),
                        trial.get('ruleParams', {}).get('shape', ''), trial.get('ruleParams', {}).get('color', ''), trial.get('ruleParams', {}).get('fill', ''),
                        trial.get('ruleParams', {}).get('feature', ''), trial.get('ruleParams', {}).get('value', ''),
                        trial.get('ruleParams', {}).get('feature1', ''), trial.get('ruleParams', {}).get('value1', ''),
                        trial.get('ruleParams', {}).get('feature2', ''), trial.get('ruleParams', {}).get('value2', ''),
                        trial.get('ruleParams', {}).get('subType', ''),
                        ';'.join(trial.get('gridConfigurationIds', [])), 
                        0, 'NO_ACTIONS', '', '', '', '', '', '', '', '', '', '', '',
                        trial.get('startTime'), trial.get('endTime'), trial.get('correctlySolved')
                    ]
                    trial_writer.writerow(row)
                else:
                    for action_idx, action in enumerate(trial.get('actions', [])):
                        row = [
                            participant_data.get('id'), trial.get('trialNumber'), trial.get('ruleType'),
                            trial.get('ruleParams', {}).get('shape', ''), trial.get('ruleParams', {}).get('color', ''), trial.get('ruleParams', {}).get('fill', ''),
                            trial.get('ruleParams', {}).get('feature', ''), trial.get('ruleParams', {}).get('value', ''),
                            trial.get('ruleParams', {}).get('feature1', ''), trial.get('ruleParams', {}).get('value1', ''),
                            trial.get('ruleParams', {}).get('feature2', ''), trial.get('ruleParams', {}).get('value2', ''),
                            trial.get('ruleParams', {}).get('subType', ''),
                            ';'.join(trial.get('gridConfigurationIds', [])),
                            action_idx + 1, action.get('actionType'), action.get('time'),
                            action.get('itemIndex', ''), action.get('itemId', ''), 
                            action.get('itemFeatures', {}).get('shape', ''), action.get('itemFeatures', {}).get('color', ''), action.get('itemFeatures', {}).get('fill', ''),
                            ';'.join(action.get('selection', [])) if action.get('actionType') == 'test' else '',
                            action.get('isAnyItemInSelectionRelevant', '') if action.get('actionType') == 'test' else '',
                            ';'.join(action.get('selection', [])) if action.get('actionType') == 'final_select' else '',
                            action.get('isCorrectFull', '') if action.get('actionType') == 'final_select' else '',
                            action.get('confidence', '') if action.get('actionType') == 'final_select' else '',
                            trial.get('startTime'), trial.get('endTime'), trial.get('correctlySolved')
                        ]
                        trial_writer.writerow(row)
        
        print(f"Datos guardados en: {filepath}")
        return jsonify({"status": "success", "message": "Datos recibidos y guardados."}), 200
    except Exception as e:
        print(f"Error al procesar datos: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Escucha en todas las interfaces de red en el puerto 5000
    # Para que otros en tu red local puedan accederlo.
    # Si estás detrás de un router, necesitarás configurar reenvío de puertos
    # para acceso desde fuera de tu red local.
    app.run(host='0.0.0.0', port=5001, debug=True) 