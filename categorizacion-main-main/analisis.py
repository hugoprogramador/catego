
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
import numpy as np
import os

# --- Constantes y Configuración ---
RULE_TYPES_ORDER = ['especifica', 'basada_caracteristicas', 'relacional', 'conjuntiva']
OUTPUT_DIR = "resultados_analisis"

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def cargar_datos(filepath):
    """Carga los datos del CSV, manejando las secciones separadas."""
    try:
        participant_info = pd.read_csv(filepath, nrows=1)
        try:
            final_questions_raw = pd.read_csv(filepath, skiprows=3, nrows=1)
            final_questions = final_questions_raw.dropna(axis=1, how='all')
        except Exception:
            print(f"Advertencia: No se pudieron leer las preguntas finales o están vacías para {filepath}.")
            final_questions = pd.DataFrame()

        skip_trials = 0
        with open(filepath, 'r', encoding='utf-8') as f:
            for i, line in enumerate(f):
                if "participant_id,trial_number,rule_type" in line:
                    skip_trials = i
                    break
        
        trial_data = pd.read_csv(filepath, skiprows=skip_trials)
        
        param_cols = ['rule_param_shape', 'rule_param_color', 'rule_param_fill', 
                      'rule_param_feature', 'rule_param_value', 
                      'rule_param_feature1', 'rule_param_value1', 
                      'rule_param_feature2', 'rule_param_value2', 'rule_param_subtype']
        for col in param_cols:
            if col in trial_data.columns:
                trial_data[col] = trial_data[col].fillna('').astype(str)
        return participant_info, final_questions, trial_data
    except FileNotFoundError:
        print(f"Error: El archivo {filepath} no fue encontrado.")
        return None, None, None
    except Exception as e:
        print(f"Error al cargar el archivo CSV {filepath}: {e}")
        return None, None, None

def calcular_moda(series):
    if series.empty or series.dropna().empty:
        return np.nan
    counts = Counter(series.dropna())
    return counts.most_common(1)[0][0]

def analizar_confianza(trial_data_df, participant_id):
    print(f"\n--- Análisis de Confianza para Participante {participant_id} ---")
    confianza_por_regla = {}
    evolucion_confianza_regla = {rule: [] for rule in RULE_TYPES_ORDER}
    
    select_actions = trial_data_df[
        (trial_data_df['action_type'] == 'final_select') & 
        (trial_data_df['confidence'].notna())
    ].copy()
    select_actions['confidence'] = pd.to_numeric(select_actions['confidence'], errors='coerce')
    select_actions.dropna(subset=['confidence'], inplace=True)

    for rule_type in RULE_TYPES_ORDER:
        acciones_regla = select_actions[select_actions['rule_type'] == rule_type]
        if not acciones_regla.empty:
            confianza_por_regla[rule_type] = calcular_moda(acciones_regla['confidence'])
            primer_intento_confianza = acciones_regla.groupby('trial_number')['confidence'].first().tolist()
            evolucion_confianza_regla[rule_type] = primer_intento_confianza
        else:
            confianza_por_regla[rule_type] = np.nan
            evolucion_confianza_regla[rule_type] = []
    print("Confianza más frecuente por tipo de regla:", confianza_por_regla)

    if not select_actions.empty:
        evolucion_confianza_global = select_actions.groupby('trial_number')['confidence'].first().tolist()
        if evolucion_confianza_global:
            plt.figure(figsize=(12, 6))
            plt.plot(range(1, len(evolucion_confianza_global) + 1), evolucion_confianza_global, marker='o', linestyle='-')
            plt.title(f'Evolución de la Confianza Global (P{participant_id})')
            plt.xlabel('Número de Ensayo Global')
            plt.ylabel('Nivel de Confianza (Primer Intento)')
            plt.yticks(range(0, 6))
            plt.grid(True)
            plt.savefig(os.path.join(OUTPUT_DIR, f"P{participant_id}_confianza_global.png"))
            plt.close()
            print("Gráfico de evolución de confianza global guardado.")

    for rule_type, conf_values in evolucion_confianza_regla.items():
        if conf_values:
            plt.figure(figsize=(8, 5))
            num_ensayos_en_regla = len(conf_values)
            plt.plot(range(1, num_ensayos_en_regla + 1), conf_values, marker='o', linestyle='-')
            plt.title(f'Evolución de Confianza para Regla: {rule_type} (P{participant_id})')
            plt.xlabel('Número de Ensayo dentro de la Regla')
            plt.ylabel('Nivel de Confianza (Primer Intento)')
            plt.xticks(range(1, num_ensayos_en_regla + 1))
            plt.yticks(range(0, 6))
            plt.grid(True)
            plt.savefig(os.path.join(OUTPUT_DIR, f"P{participant_id}_confianza_regla_{rule_type}.png"))
            plt.close()
    print("Gráficos de evolución de confianza por regla guardados.")
    return confianza_por_regla

def analizar_errores(trial_data_df, participant_id):
    print(f"\n--- Análisis de Errores para Participante {participant_id} ---")
    errores_prueba_por_regla = {}
    errores_seleccion_por_regla = {}
    
    test_actions = trial_data_df[trial_data_df['action_type'] == 'test'].copy()
    if 'is_test_any_item_relevant' in test_actions.columns and not test_actions.empty:
        test_actions['is_test_any_item_relevant'] = pd.to_numeric(test_actions['is_test_any_item_relevant'], errors='coerce').fillna(0).astype(bool)
        test_actions['error_prueba'] = ~test_actions['is_test_any_item_relevant']
        
        for rule_type in RULE_TYPES_ORDER:
            acciones_regla_prueba = test_actions[test_actions['rule_type'] == rule_type]
            if not acciones_regla_prueba.empty:
                errores_prueba_por_regla[rule_type] = acciones_regla_prueba['error_prueba'].mean()
                errores_por_ensayo_regla = acciones_regla_prueba.groupby('trial_number')['error_prueba'].mean()
                if not errores_por_ensayo_regla.empty:
                    plt.figure(figsize=(8, 5))
                    # Usar los números de ensayo reales para el eje x, pero etiquetarlos como 1-10
                    ensayos_unicos_ordenados = sorted(errores_por_ensayo_regla.index.unique())
                    x_labels = range(1, len(ensayos_unicos_ordenados) + 1)
                    plt.plot(x_labels, errores_por_ensayo_regla.loc[ensayos_unicos_ordenados].values, marker='x', linestyle='-', color='orange')
                    plt.title(f'Evolución Error Prueba para Regla: {rule_type} (P{participant_id})')
                    plt.xlabel('Número de Ensayo dentro de la Regla (secuencial)')
                    plt.ylabel('Proporción de Pruebas Incorrectas')
                    plt.ylim(-0.1, 1.1)
                    if list(x_labels): plt.xticks(x_labels)
                    plt.grid(True)
                    plt.savefig(os.path.join(OUTPUT_DIR, f"P{participant_id}_errores_prueba_regla_{rule_type}.png"))
                    plt.close()
            else:
                errores_prueba_por_regla[rule_type] = np.nan
        print("Promedio de errores en 'Pruebas' por tipo de regla:", errores_prueba_por_regla)

        errores_prueba_global_por_ensayo = test_actions.groupby('trial_number')['error_prueba'].mean()
        if not errores_prueba_global_por_ensayo.empty:
            plt.figure(figsize=(12, 6))
            plt.plot(sorted(errores_prueba_global_por_ensayo.index.unique()), errores_prueba_global_por_ensayo.values, marker='x', linestyle='-', color='coral')
            plt.title(f'Evolución Error Prueba (Global - Promedio por Ensayo) (P{participant_id})')
            plt.xlabel('Número de Ensayo Global')
            plt.ylabel('Proporción de Pruebas Incorrectas')
            plt.ylim(-0.1, 1.1)
            plt.grid(True)
            plt.savefig(os.path.join(OUTPUT_DIR, f"P{participant_id}_errores_prueba_global.png"))
            plt.close()
            print("Gráfico de evolución de errores de prueba global guardado.")
    else:
        print("No hay acciones de 'test' o columna 'is_test_any_item_relevant' para analizar errores de prueba.")

    select_actions = trial_data_df[trial_data_df['action_type'] == 'final_select'].copy()
    if 'is_final_selection_correct' in select_actions.columns and not select_actions.empty:
        select_actions['is_final_selection_correct'] = pd.to_numeric(select_actions['is_final_selection_correct'], errors='coerce').fillna(0).astype(bool)
        select_actions['error_seleccion'] = ~select_actions['is_final_selection_correct']

        for rule_type in RULE_TYPES_ORDER:
            acciones_regla_seleccion = select_actions[select_actions['rule_type'] == rule_type]
            if not acciones_regla_seleccion.empty:
                primeros_intentos_seleccion = acciones_regla_seleccion.loc[acciones_regla_seleccion.groupby('trial_number')['action_time_ms'].idxmin()]
                if not primeros_intentos_seleccion.empty:
                    errores_seleccion_por_regla[rule_type] = primeros_intentos_seleccion['error_seleccion'].mean()
                    errores_por_ensayo_regla_sel = primeros_intentos_seleccion['error_seleccion'].astype(int)
                    
                    plt.figure(figsize=(8, 5))
                    ensayos_unicos_ordenados_sel = sorted(errores_por_ensayo_regla_sel.index.unique())
                    x_labels_sel = range(1, len(ensayos_unicos_ordenados_sel) + 1)
                    plt.plot(x_labels_sel, errores_por_ensayo_regla_sel.loc[ensayos_unicos_ordenados_sel].values, marker='s', linestyle='--', color='purple')
                    plt.title(f'Evolución Error Selección para Regla: {rule_type} (P{participant_id})')
                    plt.xlabel('Número de Ensayo dentro de la Regla (secuencial)')
                    plt.ylabel('Error (1=Error, 0=Acierto)')
                    plt.ylim(-0.1, 1.1)
                    plt.yticks([0, 1])
                    if list(x_labels_sel): plt.xticks(x_labels_sel)
                    plt.grid(True)
                    plt.savefig(os.path.join(OUTPUT_DIR, f"P{participant_id}_errores_seleccion_regla_{rule_type}.png"))
                    plt.close()
                else:
                    errores_seleccion_por_regla[rule_type] = np.nan
            else:
                errores_seleccion_por_regla[rule_type] = np.nan
        print("Promedio de errores en 'Selecciones Finales' (primer intento) por tipo de regla:", errores_seleccion_por_regla)
        
        primeros_intentos_globales = select_actions.loc[select_actions.groupby('trial_number')['action_time_ms'].idxmin()]
        if not primeros_intentos_globales.empty:
            evolucion_errores_seleccion_global = primeros_intentos_globales['error_seleccion'].astype(int)
            if not evolucion_errores_seleccion_global.empty:
                plt.figure(figsize=(12, 6))
                plt.plot(sorted(evolucion_errores_seleccion_global.index.unique()), evolucion_errores_seleccion_global.values, marker='x', linestyle='-', color='red')
                plt.title(f'Evolución de Errores de Selección Final (Global - Primer Intento) (P{participant_id})')
                plt.xlabel('Número de Ensayo Global')
                plt.ylabel('Error (1=Error, 0=Acierto)')
                plt.yticks([0, 1])
                plt.grid(True)
                plt.savefig(os.path.join(OUTPUT_DIR, f"P{participant_id}_errores_seleccion_global.png"))
                plt.close()
                print("Gráfico de evolución de errores de selección global guardado.")
        print("Gráficos de evolución de errores de selección por regla guardados.")
    else:
        print("No hay acciones de 'final_select' o columna 'is_final_selection_correct' para analizar errores de selección.")
    return errores_prueba_por_regla, errores_seleccion_por_regla

def analizar_tiempos_entre_elecciones(trial_data_df, participant_id):
    print(f"\n--- Análisis de Tiempos entre Elecciones para Participante {participant_id} ---")
    
    eleccion_actions_global = trial_data_df[
        trial_data_df['action_type'].isin(['select_item', 'deselect_item'])
    ].copy()

    if eleccion_actions_global.empty:
        print("No hay acciones de selección/deselección para analizar tiempos.")
        return

    eleccion_actions_global.sort_values(by=['trial_number', 'action_time_ms'], inplace=True)
    eleccion_actions_global['time_diff_ms'] = eleccion_actions_global.groupby('trial_number')['action_time_ms'].diff()
    tiempos_entre_elecciones_global = eleccion_actions_global['time_diff_ms'].dropna().tolist()

    if tiempos_entre_elecciones_global:
        plt.figure(figsize=(12, 6))
        plt.plot(tiempos_entre_elecciones_global, marker='.', linestyle='none', alpha=0.5)
        if len(tiempos_entre_elecciones_global) >= 10:
            rolling_mean_global = pd.Series(tiempos_entre_elecciones_global).rolling(window=10).mean()
            plt.plot(rolling_mean_global.index, rolling_mean_global.values, color='red', linestyle='-', label='Promedio Móvil Global (ventana=10)')
            plt.legend()
        plt.title(f'Diferencia Temporal Entre Acciones de Selección/Deselección (Global) (P{participant_id})')
        plt.xlabel('Secuencia de Acciones de Selección/Deselección (Global)')
        plt.ylabel('Diferencia de Tiempo (ms)')
        plt.grid(True)
        plt.savefig(os.path.join(OUTPUT_DIR, f"P{participant_id}_tiempo_entre_elecciones_global.png"))
        plt.close()
        print("Gráfico de tiempo entre elecciones (global) guardado.")
    else:
        print("No hay suficientes acciones globales consecutivas de selección/deselección para analizar tiempos.")

    # --- NUEVO: Análisis de tiempos entre elecciones POR REGLA ---
    for rule_type in RULE_TYPES_ORDER:
        eleccion_actions_regla = eleccion_actions_global[eleccion_actions_global['rule_type'] == rule_type].copy()
        if eleccion_actions_regla.empty:
            print(f"  Regla {rule_type}: No hay acciones de selección/deselección.")
            continue
        
        # Asegurar el orden correcto para .diff() dentro de cada ensayo y luego concatenar
        # Primero agrupar por ensayo, calcular diff, y luego recolectar
        all_diffs_regla = []
        for _, group in eleccion_actions_regla.groupby('trial_number'):
            group_sorted = group.sort_values('action_time_ms')
            diffs_in_trial = group_sorted['action_time_ms'].diff().dropna().tolist()
            all_diffs_regla.extend(diffs_in_trial)

        if all_diffs_regla:
            plt.figure(figsize=(10, 5))
            plt.plot(all_diffs_regla, marker='.', linestyle='none', alpha=0.6, label=f'Acciones para regla {rule_type}')
            if len(all_diffs_regla) >= 10:
                rolling_mean_regla = pd.Series(all_diffs_regla).rolling(window=10).mean()
                plt.plot(rolling_mean_regla.index, rolling_mean_regla.values, color='blue', linestyle='-', 
                         label=f'Promedio Móvil Regla {rule_type} (ventana=10)')
            plt.title(f'Diferencia Temporal Entre Acciones de Sel/Desel. para Regla: {rule_type} (P{participant_id})')
            plt.xlabel(f'Secuencia de Acciones de Sel/Desel. (Regla {rule_type})')
            plt.ylabel('Diferencia de Tiempo (ms)')
            plt.legend()
            plt.grid(True)
            plt.savefig(os.path.join(OUTPUT_DIR, f"P{participant_id}_tiempo_entre_elecciones_regla_{rule_type}.png"))
            plt.close()
        else:
            print(f"  Regla {rule_type}: No hay suficientes acciones consecutivas para calcular diferencias de tiempo.")
    print("Gráficos de tiempo entre elecciones por regla guardados.")


def analizar_selecciones_frecuentes(trial_data_df, participant_id):
    print(f"\n--- Análisis de Selecciones Frecuentes para Participante {participant_id} ---")
    acciones_relevantes = trial_data_df[
        trial_data_df['action_type'].isin(['final_select', 'test'])
    ].copy()

    for rule_type in RULE_TYPES_ORDER:
        print(f"\n  Regla: {rule_type}")
        acciones_regla = acciones_relevantes[acciones_relevantes['rule_type'] == rule_type]
        if acciones_regla.empty:
            print("    No hay acciones registradas para esta regla.")
            continue

        all_selected_features = {'shape': [], 'color': [], 'fill': []}
        total_items_considered_for_features = 0

        for _, row in acciones_regla.iterrows():
            ids_str = row['final_selection_ids'] if pd.notna(row['final_selection_ids']) and row['final_selection_ids'] else \
                      row['tested_selection_ids'] if pd.notna(row['tested_selection_ids']) and row['tested_selection_ids'] else ''
            if not ids_str: continue
            selected_ids = str(ids_str).split(';')
            
            for stimulus_id_jpg in selected_ids:
                if not stimulus_id_jpg or not isinstance(stimulus_id_jpg, str) or '.jpg' not in stimulus_id_jpg : continue
                try:
                    parts = stimulus_id_jpg.replace('.jpg', '').split('_')
                    if len(parts) == 3:
                        all_selected_features['shape'].append(parts[0])
                        all_selected_features['color'].append(parts[1])
                        all_selected_features['fill'].append(parts[2])
                        total_items_considered_for_features +=1 
                except Exception as e:
                    print(f"    Advertencia: No se pudo parsear el ID '{stimulus_id_jpg}' para características: {e}")
        
        if total_items_considered_for_features == 0:
             print("    No se pudieron extraer características de las selecciones.")
             continue

        for feature_dim in ['shape', 'color', 'fill']:
            counts = Counter(all_selected_features[feature_dim])
            print(f"    Frecuencia de {feature_dim.capitalize()}s Seleccionados:", counts.most_common(3))
            if counts: # Solo calcular proporción si hay conteos
                most_common_item, most_common_count = counts.most_common(1)[0]
                # El total de ítems para la proporción debe ser el número total de veces que se seleccionó ESA característica
                total_for_this_feature_dim = len(all_selected_features[feature_dim])
                if total_for_this_feature_dim > 0:
                    proportion = most_common_count / total_for_this_feature_dim 
                    print(f"      Característica más frecuente ('{most_common_item}'): {most_common_count} veces, Proporción dentro de '{feature_dim}': {proportion:.2f}")
                else:
                    print(f"      No se seleccionaron {feature_dim}s para calcular proporción.")
            else:
                print(f"      No se seleccionaron {feature_dim}s.")


if __name__ == "__main__":
    archivos_csv = [f for f in os.listdir('.') if f.startswith("experiment_data_P") and f.endswith(".csv")]
    if not archivos_csv:
        print("No se encontraron archivos CSV de datos en el directorio actual que coincidan con el patrón 'experiment_data_P*.csv'.")
    
    for archivo_csv in archivos_csv:
        print(f"\n\n================ PROCESANDO ARCHIVO: {archivo_csv} ================")
        participante, preguntas_finales, datos_ensayos = cargar_datos(archivo_csv)

        if datos_ensayos is not None and participante is not None:
            participante_id_str = str(participante['participant_id'].iloc[0])
            print(f"Análisis para Participante: {participante_id_str}, Grupo: {participante['group'].iloc[0]}")

            if not preguntas_finales.empty:
                print("\n--- Respuestas a Preguntas Finales ---")
                for col in preguntas_finales.columns:
                    # Asegurarse de que el valor no sea NaN antes de intentar acceder a .iloc[0]
                    val = preguntas_finales[col].iloc[0] if pd.notna(preguntas_finales[col].iloc[0]) else "N/A"
                    print(f"  {col}: {val}")
            else:
                print("\nNo se encontraron datos de preguntas finales para este participante.")

            confianza_resultados = analizar_confianza(datos_ensayos, participante_id_str)
            errores_prueba_res, errores_seleccion_res = analizar_errores(datos_ensayos, participante_id_str)
            analizar_tiempos_entre_elecciones(datos_ensayos, participante_id_str)
            analizar_selecciones_frecuentes(datos_ensayos, participante_id_str)

            print("\n--- Resumen de Resultados Numéricos ---")
            print(f"Confianza más frecuente por regla (P{participante_id_str}):", confianza_resultados)
            print(f"Promedio errores en pruebas por regla (P{participante_id_str}):", errores_prueba_res)
            print(f"Promedio errores en selección (1er intento) por regla (P{participante_id_str}):", errores_seleccion_res)
        else:
            print(f"No se pudieron cargar los datos para el archivo {archivo_csv}.")