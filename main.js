// main.js

// --- CONFIGURACIÓN INICIAL DEL EXPERIMENTO -----------------------------------------------------------------------

// --- DECLARACIÓN DE VARIABLES BÁSICAS ----------------------------------------------------------------------------
const CONFIG = {
    numTrialsPerRule: 10,
    totalRuleTypes: 4,
    gridSize: 4 * 4,
    penalties: {
        test: 0, // PUESTO EN 0 PARA PRUEBAS RÁPIDAS, CAMBIAR A 3000
        select: 0, // PUESTO EN 0 PARA PRUEBAS RÁPIDAS, CAMBIAR A 6000
    },
    imagePath: 'images/' 
};

const RULE_TYPES = {
    SPECIFIC: 'especifica',
    FEATURE_BASED: 'basada_caracteristicas',
    RELATIONAL: 'relacional',
    CONJUNCTIVE: 'conjuntiva'
};

const SHAPES = ['circulo', 'cuadrado', 'pentagono', 'trapecio'];
const COLORS = ['rosa', 'morado', 'azul', 'naranja'];
const FILLS = ['circulo', 'cuadrado', 'pentagono', 'trapecio'];

// --- CONFIGURACIÓN DE TODOS LOS ENSAYOS (REGLAS Y CUADRÍCULAS) ---------------------------------------------------
const PREDEFINED_TRIALS_SETUP = {
    [RULE_TYPES.SPECIFIC]: [
        { ruleParams: { shape: 'circulo', color: 'rosa', fill: 'pentagono' }, gridStimuliIds: ['cuadrado_azul_pentagono.jpg', 'trapecio_morado_trapecio.jpg', 'pentagono_azul_trapecio.jpg', 'circulo_morado_cuadrado.jpg', 'trapecio_naranja_circulo.jpg', 'pentagono_naranja_cuadrado.jpg', 'circulo_rosa_pentagono.jpg', 'cuadrado_rosa_circulo.jpg', 'pentagono_morado_circulo.jpg', 'cuadrado_morado_cuadrado.jpg', 'trapecio_azul_pentagono.jpg', 'circulo_naranja_trapecio.jpg', 'circulo_azul_circulo.jpg', 'pentagono_rosa_circulo.jpg', 'trapecio_rosa_cuadrado.jpg', 'cuadrado_naranja_trapecio.jpg']},
        { ruleParams: { shape: 'cuadrado', color: 'azul', fill: 'circulo' }, gridStimuliIds: ['pentagono_azul_cuadrado.jpg', 'trapecio_naranja_trapecio.jpg', 'cuadrado_morado_pentagono.jpg', 'cuadrado_naranja_pentagono.jpg', 'circulo_azul_pentagono.jpg', 'circulo_rosa_cuadrado.jpg', 'trapecio_morado_circulo.jpg', 'pentagono_rosa_trapecio.jpg', 'circulo_naranja_cuadrado.jpg', 'trapecio_azul_cuadrado.jpg', 'pentagono_morado_pentagono.jpg', 'cuadrado_azul_circulo.jpg', 'trapecio_rosa_pentagono.jpg', 'circulo_morado_circulo.jpg', 'cuadrado_rosa_trapecio.jpg', 'pentagono_naranja_circulo.jpg']},
        { ruleParams: { shape: 'pentagono', color: 'naranja', fill: 'trapecio' }, gridStimuliIds: ['cuadrado_azul_trapecio.jpg', 'trapecio_azul_trapecio.jpg', 'trapecio_rosa_circulo.jpg', 'pentagono_morado_circulo.jpg', 'circulo_naranja_circulo.jpg', 'circulo_morado_trapecio.jpg', 'cuadrado_naranja_circulo.jpg', 'pentagono_naranja_trapecio.jpg', 'cuadrado_rosa_circulo.jpg', 'pentagono_azul_cuadrado.jpg', 'trapecio_naranja_pentagono.jpg', 'circulo_rosa_cuadrado.jpg', 'pentagono_rosa_pentagono.jpg', 'trapecio_morado_cuadrado.jpg', 'circulo_azul_pentagono.jpg', 'cuadrado_morado_pentagono.jpg']},
        { ruleParams: { shape: 'trapecio', color: 'morado', fill: 'cuadrado' }, gridStimuliIds: ['pentagono_azul_circulo.jpg', 'trapecio_morado_cuadrado.jpg', 'circulo_morado_circulo.jpg', 'cuadrado_naranja_pentagono.jpg', 'cuadrado_rosa_pentagono.jpg', 'cuadrado_azul_cuadrado.jpg', 'pentagono_naranja_trapecio.jpg', 'trapecio_naranja_pentagono.jpg', 'circulo_rosa_trapecio.jpg', 'trapecio_azul_circulo.jpg', 'circulo_azul_pentagono.jpg', 'pentagono_rosa_cuadrado.jpg', 'cuadrado_morado_circulo.jpg', 'pentagono_morado_pentagono.jpg', 'trapecio_rosa_trapecio.jpg', 'circulo_naranja_pentagono.jpg']},
        { ruleParams: { shape: 'circulo', color: 'azul', fill: 'circulo' }, gridStimuliIds: ['cuadrado_rosa_circulo.jpg', 'cuadrado_morado_pentagono.jpg', 'pentagono_naranja_circulo.jpg', 'circulo_naranja_pentagono.jpg', 'trapecio_azul_cuadrado.jpg', 'trapecio_rosa_pentagono.jpg', 'circulo_azul_circulo.jpg', 'pentagono_azul_trapecio.jpg', 'circulo_morado_trapecio.jpg', 'cuadrado_azul_cuadrado.jpg', 'trapecio_naranja_circulo.jpg', 'pentagono_rosa_pentagono.jpg', 'pentagono_morado_cuadrado.jpg', 'trapecio_morado_pentagono.jpg', 'cuadrado_naranja_trapecio.jpg', 'circulo_rosa_cuadrado.jpg']},
        { ruleParams: { shape: 'cuadrado', color: 'rosa', fill: 'circulo' }, gridStimuliIds: ['pentagono_azul_pentagono.jpg', 'trapecio_morado_circulo.jpg', 'cuadrado_azul_trapecio.jpg', 'cuadrado_rosa_circulo.jpg', 'trapecio_naranja_trapecio.jpg', 'circulo_azul_cuadrado.jpg', 'pentagono_naranja_cuadrado.jpg', 'circulo_naranja_pentagono.jpg', 'cuadrado_morado_pentagono.jpg', 'circulo_morado_circulo.jpg', 'cuadrado_naranja_cuadrado.jpg', 'trapecio_azul_cuadrado.jpg', 'pentagono_rosa_circulo.jpg', 'circulo_rosa_pentagono.jpg', 'pentagono_morado_trapecio.jpg', 'trapecio_rosa_pentagono.jpg']},
        { ruleParams: { shape: 'pentagono', color: 'morado', fill: 'pentagono' }, gridStimuliIds: ['trapecio_naranja_cuadrado.jpg', 'pentagono_azul_trapecio.jpg', 'cuadrado_morado_circulo.jpg', 'circulo_azul_circulo.jpg', 'circulo_rosa_trapecio.jpg', 'cuadrado_azul_circulo.jpg', 'cuadrado_naranja_trapecio.jpg', 'pentagono_morado_pentagono.jpg', 'trapecio_morado_trapecio.jpg', 'trapecio_azul_pentagono.jpg', 'pentagono_naranja_cuadrado.jpg', 'circulo_morado_cuadrado.jpg', 'pentagono_rosa_circulo.jpg', 'trapecio_rosa_circulo.jpg', 'circulo_naranja_pentagono.jpg', 'cuadrado_rosa_pentagono.jpg']},
        { ruleParams: { shape: 'trapecio', color: 'naranja', fill: 'trapecio' }, gridStimuliIds: ['trapecio_azul_pentagono.jpg', 'cuadrado_naranja_cuadrado.jpg', 'pentagono_naranja_circulo.jpg', 'cuadrado_rosa_circulo.jpg', 'trapecio_naranja_trapecio.jpg', 'circulo_azul_cuadrado.jpg', 'circulo_morado_trapecio.jpg', 'pentagono_morado_circulo.jpg', 'trapecio_morado_cuadrado.jpg', 'circulo_rosa_cuadrado.jpg', 'pentagono_rosa_circulo.jpg', 'cuadrado_morado_pentagono.jpg', 'trapecio_rosa_pentagono.jpg', 'pentagono_azul_trapecio.jpg', 'circulo_naranja_pentagono.jpg', 'cuadrado_azul_trapecio.jpg']},
        { ruleParams: { shape: 'circulo', color: 'morado', fill: 'cuadrado' }, gridStimuliIds: ['trapecio_naranja_pentagono.jpg', 'pentagono_naranja_trapecio.jpg', 'trapecio_azul_circulo.jpg', 'circulo_morado_cuadrado.jpg', 'cuadrado_naranja_trapecio.jpg', 'pentagono_azul_cuadrado.jpg', 'circulo_azul_circulo.jpg', 'circulo_naranja_trapecio.jpg', 'cuadrado_rosa_pentagono.jpg', 'cuadrado_azul_circulo.jpg', 'trapecio_morado_pentagono.jpg', 'pentagono_rosa_trapecio.jpg', 'cuadrado_morado_circulo.jpg', 'trapecio_rosa_cuadrado.jpg', 'pentagono_morado_circulo.jpg', 'circulo_rosa_pentagono.jpg']},
        { ruleParams: { shape: 'pentagono', color: 'rosa', fill: 'circulo' }, gridStimuliIds: ['pentagono_azul_pentagono.jpg', 'circulo_morado_trapecio.jpg', 'cuadrado_morado_circulo.jpg', 'trapecio_naranja_cuadrado.jpg', 'trapecio_azul_pentagono.jpg', 'pentagono_rosa_circulo.jpg', 'cuadrado_rosa_trapecio.jpg', 'pentagono_naranja_trapecio.jpg', 'circulo_naranja_circulo.jpg', 'cuadrado_azul_pentagono.jpg', 'trapecio_morado_circulo.jpg', 'circulo_rosa_cuadrado.jpg', 'pentagono_morado_cuadrado.jpg', 'trapecio_rosa_trapecio.jpg', 'cuadrado_naranja_cuadrado.jpg', 'circulo_azul_pentagono.jpg']}
    ],
    [RULE_TYPES.FEATURE_BASED]: [
        { ruleParams: { feature: 'color', value: 'morado' }, gridStimuliIds: ['cuadrado_morado_pentagono.jpg', 'pentagono_azul_circulo.jpg', 'circulo_morado_circulo.jpg', 'cuadrado_morado_trapecio.jpg', 'cuadrado_azul_trapecio.jpg', 'pentagono_morado_trapecio.jpg', 'trapecio_morado_cuadrado.jpg', 'pentagono_naranja_cuadrado.jpg', 'circulo_morado_pentagono.jpg', 'trapecio_azul_pentagono.jpg', 'trapecio_rosa_cuadrado.jpg', 'pentagono_rosa_circulo.jpg', 'circulo_naranja_pentagono.jpg', 'circulo_azul_trapecio.jpg', 'trapecio_naranja_pentagono.jpg', 'cuadrado_rosa_cuadrado.jpg']},
        { ruleParams: { feature: 'shape', value: 'pentagono' }, gridStimuliIds: ['pentagono_morado_circulo.jpg', 'pentagono_morado_pentagono.jpg', 'trapecio_naranja_cuadrado.jpg', 'cuadrado_rosa_trapecio.jpg', 'pentagono_rosa_circulo.jpg', 'trapecio_morado_circulo.jpg', 'circulo_naranja_trapecio.jpg', 'circulo_rosa_cuadrado.jpg', 'pentagono_naranja_cuadrado.jpg', 'cuadrado_azul_cuadrado.jpg', 'circulo_morado_circulo.jpg', 'cuadrado_naranja_pentagono.jpg', 'pentagono_azul_trapecio.jpg', 'trapecio_rosa_pentagono.jpg', 'circulo_azul_pentagono.jpg', 'pentagono_rosa_trapecio.jpg']},
        { ruleParams: { feature: 'fill', value: 'trapecio' }, gridStimuliIds: ['cuadrado_rosa_trapecio.jpg', 'pentagono_naranja_trapecio.jpg', 'trapecio_azul_circulo.jpg', 'circulo_morado_trapecio.jpg', 'pentagono_rosa_circulo.jpg', 'cuadrado_morado_circulo.jpg', 'pentagono_morado_trapecio.jpg', 'cuadrado_azul_pentagono.jpg', 'trapecio_rosa_cuadrado.jpg', 'circulo_azul_trapecio.jpg', 'trapecio_naranja_pentagono.jpg', 'circulo_naranja_cuadrado.jpg', 'circulo_rosa_trapecio.jpg', 'pentagono_azul_trapecio.jpg', 'cuadrado_naranja_trapecio.jpg', 'trapecio_morado_pentagono.jpg']},
        { ruleParams: { feature: 'color', value: 'azul' }, gridStimuliIds: ['pentagono_azul_circulo.jpg', 'pentagono_rosa_trapecio.jpg', 'circulo_azul_pentagono.jpg', 'trapecio_azul_trapecio.jpg', 'cuadrado_rosa_trapecio.jpg', 'cuadrado_azul_circulo.jpg', 'trapecio_rosa_circulo.jpg', 'cuadrado_azul_pentagono.jpg', 'circulo_rosa_circulo.jpg', 'circulo_naranja_cuadrado.jpg', 'trapecio_morado_pentagono.jpg', 'circulo_azul_cuadrado.jpg', 'pentagono_morado_cuadrado.jpg', 'cuadrado_naranja_circulo.jpg', 'pentagono_naranja_pentagono.jpg', 'trapecio_azul_circulo.jpg']},
        { ruleParams: { feature: 'shape', value: 'circulo' }, gridStimuliIds: ['circulo_naranja_circulo.jpg', 'cuadrado_morado_circulo.jpg', 'circulo_rosa_pentagono.jpg', 'trapecio_azul_pentagono.jpg', 'pentagono_azul_circulo.jpg', 'circulo_morado_pentagono.jpg', 'trapecio_naranja_cuadrado.jpg', 'cuadrado_azul_cuadrado.jpg', 'pentagono_rosa_trapecio.jpg', 'circulo_azul_trapecio.jpg', 'circulo_rosa_circulo.jpg', 'trapecio_morado_trapecio.jpg', 'cuadrado_naranja_pentagono.jpg', 'pentagono_naranja_pentagono.jpg', 'trapecio_rosa_circulo.jpg', 'circulo_morado_cuadrado.jpg']},
        { ruleParams: { feature: 'fill', value: 'cuadrado' }, gridStimuliIds: ['circulo_azul_cuadrado.jpg', 'trapecio_naranja_cuadrado.jpg', 'trapecio_azul_pentagono.jpg', 'circulo_rosa_trapecio.jpg', 'pentagono_azul_circulo.jpg', 'cuadrado_rosa_cuadrado.jpg', 'cuadrado_morado_cuadrado.jpg', 'trapecio_rosa_cuadrado.jpg', 'pentagono_naranja_circulo.jpg', 'cuadrado_naranja_circulo.jpg', 'circulo_naranja_cuadrado.jpg', 'pentagono_morado_trapecio.jpg', 'trapecio_morado_cuadrado.jpg', 'cuadrado_azul_cuadrado.jpg', 'pentagono_rosa_pentagono.jpg', 'circulo_morado_pentagono.jpg']},
        { ruleParams: { feature: 'color', value: 'rosa' }, gridStimuliIds: ['cuadrado_rosa_pentagono.jpg', 'pentagono_rosa_pentagono.jpg', 'circulo_naranja_cuadrado.jpg', 'circulo_rosa_trapecio.jpg', 'cuadrado_azul_circulo.jpg', 'trapecio_rosa_cuadrado.jpg', 'cuadrado_rosa_trapecio.jpg', 'pentagono_azul_pentagono.jpg', 'trapecio_naranja_pentagono.jpg', 'trapecio_morado_circulo.jpg', 'pentagono_naranja_circulo.jpg', 'circulo_rosa_circulo.jpg', 'pentagono_morado_trapecio.jpg', 'cuadrado_morado_cuadrado.jpg', 'circulo_azul_pentagono.jpg', 'trapecio_azul_trapecio.jpg']},
        { ruleParams: { feature: 'shape', value: 'trapecio' }, gridStimuliIds: ['cuadrado_rosa_trapecio.jpg', 'pentagono_naranja_cuadrado.jpg', 'trapecio_morado_trapecio.jpg', 'trapecio_azul_circulo.jpg', 'pentagono_azul_trapecio.jpg', 'trapecio_naranja_pentagono.jpg', 'circulo_azul_circulo.jpg', 'circulo_morado_pentagono.jpg', 'trapecio_morado_circulo.jpg', 'circulo_naranja_cuadrado.jpg', 'cuadrado_azul_pentagono.jpg', 'pentagono_morado_circulo.jpg', 'trapecio_rosa_cuadrado.jpg', 'circulo_rosa_trapecio.jpg', 'cuadrado_naranja_circulo.jpg', 'pentagono_rosa_pentagono.jpg']},
        { ruleParams: { feature: 'fill', value: 'pentagono' }, gridStimuliIds: ['cuadrado_azul_cuadrado.jpg', 'circulo_morado_circulo.jpg', 'cuadrado_rosa_pentagono.jpg', 'circulo_naranja_pentagono.jpg', 'pentagono_azul_cuadrado.jpg', 'trapecio_naranja_pentagono.jpg', 'trapecio_morado_circulo.jpg', 'cuadrado_naranja_pentagono.jpg', 'circulo_azul_pentagono.jpg', 'pentagono_naranja_cuadrado.jpg', 'trapecio_azul_pentagono.jpg', 'cuadrado_morado_pentagono.jpg', 'pentagono_rosa_circulo.jpg', 'circulo_rosa_pentagono.jpg', 'pentagono_morado_trapecio.jpg', 'trapecio_rosa_trapecio.jpg']},
        { ruleParams: { feature: 'color', value: 'naranja' }, gridStimuliIds: ['pentagono_naranja_cuadrado.jpg', 'cuadrado_naranja_circulo.jpg', 'trapecio_morado_circulo.jpg', 'cuadrado_azul_pentagono.jpg', 'circulo_naranja_trapecio.jpg', 'circulo_morado_cuadrado.jpg', 'trapecio_rosa_cuadrado.jpg', 'pentagono_morado_pentagono.jpg', 'circulo_naranja_circulo.jpg', 'trapecio_naranja_pentagono.jpg', 'cuadrado_rosa_trapecio.jpg', 'pentagono_rosa_circulo.jpg', 'trapecio_azul_pentagono.jpg', 'pentagono_naranja_pentagono.jpg', 'circulo_azul_circulo.jpg', 'cuadrado_morado_trapecio.jpg']}
    ],
    [RULE_TYPES.RELATIONAL]: [
        { ruleParams: { subType: 'exact_one', feature: 'color', value: 'rosa' }, gridStimuliIds: ['circulo_naranja_trapecio.jpg', 'pentagono_azul_trapecio.jpg', 'circulo_rosa_pentagono.jpg', 'trapecio_azul_pentagono.jpg', 'cuadrado_morado_pentagono.jpg', 'cuadrado_naranja_circulo.jpg', 'cuadrado_azul_pentagono.jpg', 'pentagono_naranja_cuadrado.jpg', 'trapecio_naranja_circulo.jpg', 'cuadrado_morado_cuadrado.jpg', 'circulo_azul_circulo.jpg', 'trapecio_morado_trapecio.jpg', 'pentagono_morado_circulo.jpg', 'circulo_morado_cuadrado.jpg', 'pentagono_azul_circulo.jpg', 'trapecio_naranja_pentagono.jpg']},
        { ruleParams: { subType: 'share_two', feature: 'shape', value: 'cuadrado' }, gridStimuliIds: ['pentagono_morado_circulo.jpg', 'trapecio_rosa_circulo.jpg', 'circulo_morado_cuadrado.jpg', 'pentagono_naranja_cuadrado.jpg', 'trapecio_morado_cuadrado.jpg', 'cuadrado_azul_pentagono.jpg', 'circulo_azul_circulo.jpg', 'circulo_rosa_pentagono.jpg', 'trapecio_naranja_pentagono.jpg', 'circulo_naranja_pentagono.jpg', 'cuadrado_rosa_circulo.jpg', 'pentagono_azul_pentagono.jpg', 'pentagono_rosa_trapecio.jpg', 'circulo_morado_trapecio.jpg', 'trapecio_azul_circulo.jpg', 'pentagono_naranja_trapecio.jpg']},
        { ruleParams: { subType: 'all_except_one', feature: 'fill', value: 'pentagono' }, gridStimuliIds: ['circulo_azul_pentagono.jpg', 'cuadrado_naranja_pentagono.jpg', 'trapecio_morado_pentagono.jpg', 'pentagono_morado_pentagono.jpg', 'trapecio_naranja_pentagono.jpg', 'cuadrado_rosa_pentagono.jpg', 'pentagono_rosa_pentagono.jpg', 'trapecio_azul_circulo.jpg', 'circulo_naranja_pentagono.jpg', 'circulo_rosa_pentagono.jpg', 'cuadrado_morado_pentagono.jpg', 'pentagono_naranja_pentagono.jpg', 'trapecio_rosa_pentagono.jpg', 'pentagono_azul_pentagono.jpg', 'circulo_morado_pentagono.jpg', 'cuadrado_azul_pentagono.jpg']},
        { ruleParams: { subType: 'exact_one', feature: 'color', value: 'naranja' }, gridStimuliIds: ['circulo_rosa_cuadrado.jpg', 'pentagono_azul_circulo.jpg', 'cuadrado_morado_circulo.jpg', 'trapecio_azul_cuadrado.jpg', 'circulo_azul_pentagono.jpg', 'pentagono_morado_pentagono.jpg', 'cuadrado_rosa_circulo.jpg', 'trapecio_morado_cuadrado.jpg', 'pentagono_naranja_circulo.jpg', 'trapecio_rosa_pentagono.jpg', 'circulo_morado_circulo.jpg', 'cuadrado_morado_pentagono.jpg', 'pentagono_rosa_cuadrado.jpg', 'trapecio_azul_trapecio.jpg', 'cuadrado_azul_trapecio.jpg', 'circulo_rosa_trapecio.jpg']},
        { ruleParams: { subType: 'share_two', feature: 'shape', value: 'trapecio' }, gridStimuliIds: ['pentagono_azul_circulo.jpg', 'trapecio_rosa_circulo.jpg', 'cuadrado_naranja_pentagono.jpg', 'circulo_azul_circulo.jpg', 'circulo_morado_pentagono.jpg', 'pentagono_naranja_cuadrado.jpg', 'cuadrado_rosa_trapecio.jpg', 'circulo_rosa_cuadrado.jpg', 'pentagono_rosa_trapecio.jpg', 'cuadrado_morado_circulo.jpg', 'circulo_morado_cuadrado.jpg', 'trapecio_azul_pentagono.jpg', 'circulo_naranja_pentagono.jpg', 'cuadrado_azul_pentagono.jpg', 'pentagono_naranja_circulo.jpg', 'pentagono_morado_pentagono.jpg']},
        { ruleParams: { subType: 'all_except_one', feature: 'fill', value: 'circulo' }, gridStimuliIds: ['trapecio_morado_circulo.jpg', 'circulo_morado_circulo.jpg', 'trapecio_azul_circulo.jpg', 'cuadrado_naranja_circulo.jpg', 'pentagono_naranja_circulo.jpg', 'cuadrado_rosa_circulo.jpg', 'trapecio_rosa_circulo.jpg', 'pentagono_azul_circulo.jpg', 'cuadrado_azul_circulo.jpg', 'pentagono_morado_circulo.jpg', 'circulo_rosa_circulo.jpg', 'circulo_azul_circulo.jpg', 'trapecio_naranja_circulo.jpg', 'cuadrado_morado_circulo.jpg', 'pentagono_rosa_circulo.jpg', 'circulo_naranja_pentagono.jpg' ]},
        { ruleParams: { subType: 'exact_one', feature: 'color', value: 'morado' }, gridStimuliIds: ['circulo_rosa_cuadrado.jpg', 'pentagono_naranja_circulo.jpg', 'trapecio_naranja_cuadrado.jpg', 'trapecio_azul_circulo.jpg', 'cuadrado_naranja_circulo.jpg', 'cuadrado_rosa_trapecio.jpg', 'cuadrado_azul_pentagono.jpg', 'trapecio_rosa_circulo.jpg', 'cuadrado_morado_trapecio.jpg', 'pentagono_rosa_pentagono.jpg', 'pentagono_azul_cuadrado.jpg', 'circulo_naranja_pentagono.jpg', 'circulo_azul_circulo.jpg', 'trapecio_azul_pentagono.jpg', 'circulo_rosa_trapecio.jpg', 'pentagono_naranja_trapecio.jpg']},
        { ruleParams: { subType: 'share_two', feature: 'shape', value: 'circulo' }, gridStimuliIds: ['trapecio_azul_pentagono.jpg', 'pentagono_azul_trapecio.jpg', 'pentagono_rosa_trapecio.jpg', 'cuadrado_azul_trapecio.jpg', 'circulo_rosa_pentagono.jpg', 'cuadrado_naranja_circulo.jpg', 'trapecio_morado_circulo.jpg', 'pentagono_azul_pentagono.jpg', 'cuadrado_naranja_cuadrado.jpg', 'cuadrado_rosa_circulo.jpg', 'circulo_azul_cuadrado.jpg', 'trapecio_naranja_pentagono.jpg', 'pentagono_naranja_circulo.jpg', 'pentagono_morado_circulo.jpg', 'cuadrado_morado_trapecio.jpg', 'trapecio_rosa_cuadrado.jpg']},
        { ruleParams: { subType: 'all_except_one', feature: 'fill', value: 'trapecio' }, gridStimuliIds: ['circulo_azul_trapecio.jpg', 'cuadrado_rosa_trapecio.jpg', 'circulo_naranja_trapecio.jpg', 'pentagono_rosa_trapecio.jpg', 'pentagono_naranja_trapecio.jpg', 'cuadrado_naranja_trapecio.jpg', 'cuadrado_morado_trapecio.jpg', 'trapecio_azul_trapecio.jpg', 'circulo_rosa_trapecio.jpg', 'trapecio_rosa_trapecio.jpg', 'pentagono_azul_trapecio.jpg', 'trapecio_naranja_trapecio.jpg', 'trapecio_morado_trapecio.jpg', 'pentagono_morado_trapecio.jpg', 'cuadrado_azul_pentagono.jpg', 'circulo_morado_trapecio.jpg']},
        { ruleParams: { subType: 'exact_one', feature: 'color', value: 'azul' }, gridStimuliIds: ['cuadrado_morado_trapecio.jpg', 'trapecio_rosa_trapecio.jpg', 'pentagono_naranja_pentagono.jpg', 'circulo_naranja_trapecio.jpg', 'pentagono_morado_circulo.jpg', 'trapecio_morado_pentagono.jpg', 'circulo_rosa_circulo.jpg', 'cuadrado_naranja_circulo.jpg', 'pentagono_naranja_cuadrado.jpg', 'circulo_morado_cuadrado.jpg', 'cuadrado_rosa_pentagono.jpg', 'trapecio_azul_circulo.jpg', 'pentagono_rosa_trapecio.jpg', 'circulo_rosa_pentagono.jpg', 'cuadrado_morado_cuadrado.jpg', 'trapecio_naranja_cuadrado.jpg']}
    ],
    [RULE_TYPES.CONJUNCTIVE]: [
        { ruleParams: { feature1: 'color', value1: 'azul', feature2: 'shape', value2: 'trapecio' }, gridStimuliIds: ['trapecio_azul_cuadrado.jpg', 'trapecio_morado_trapecio.jpg', 'circulo_azul_pentagono.jpg', 'cuadrado_rosa_pentagono.jpg', 'pentagono_morado_circulo.jpg', 'pentagono_rosa_pentagono.jpg', 'cuadrado_azul_circulo.jpg', 'pentagono_azul_trapecio.jpg', 'circulo_morado_cuadrado.jpg', 'circulo_rosa_circulo.jpg', 'trapecio_rosa_cuadrado.jpg', 'cuadrado_morado_cuadrado.jpg', 'circulo_naranja_trapecio.jpg', 'pentagono_naranja_cuadrado.jpg', 'trapecio_naranja_circulo.jpg', 'cuadrado_naranja_trapecio.jpg']},
        { ruleParams: { feature1: 'fill', value1: 'pentagono', feature2: 'color', value2: 'naranja' }, gridStimuliIds: ['cuadrado_naranja_pentagono.jpg', 'trapecio_azul_cuadrado.jpg', 'pentagono_azul_trapecio.jpg', 'trapecio_rosa_circulo.jpg', 'cuadrado_morado_pentagono.jpg', 'circulo_azul_cuadrado.jpg', 'pentagono_naranja_cuadrado.jpg', 'circulo_morado_pentagono.jpg', 'circulo_rosa_pentagono.jpg', 'pentagono_rosa_pentagono.jpg', 'trapecio_morado_pentagono.jpg', 'cuadrado_naranja_circulo.jpg', 'pentagono_morado_circulo.jpg', 'trapecio_naranja_pentagono.jpg', 'cuadrado_rosa_trapecio.jpg', 'circulo_naranja_pentagono.jpg']},
        { ruleParams: { feature1: 'shape', value1: 'circulo', feature2: 'fill', value2: 'circulo' }, gridStimuliIds: ['circulo_azul_pentagono.jpg', 'circulo_rosa_circulo.jpg', 'pentagono_azul_trapecio.jpg', 'cuadrado_morado_circulo.jpg', 'trapecio_naranja_circulo.jpg', 'pentagono_rosa_circulo.jpg', 'trapecio_azul_pentagono.jpg', 'pentagono_morado_circulo.jpg', 'circulo_naranja_trapecio.jpg', 'cuadrado_rosa_pentagono.jpg', 'circulo_morado_cuadrado.jpg', 'trapecio_rosa_cuadrado.jpg', 'cuadrado_azul_circulo.jpg', 'cuadrado_naranja_trapecio.jpg', 'trapecio_morado_trapecio.jpg', 'pentagono_naranja_circulo.jpg']},
        { ruleParams: { feature1: 'color', value1: 'rosa', feature2: 'shape', value2: 'pentagono' }, gridStimuliIds: ['trapecio_naranja_circulo.jpg', 'pentagono_morado_circulo.jpg', 'cuadrado_rosa_trapecio.jpg', 'circulo_rosa_pentagono.jpg', 'trapecio_azul_pentagono.jpg', 'pentagono_naranja_trapecio.jpg', 'cuadrado_naranja_pentagono.jpg', 'circulo_azul_circulo.jpg', 'trapecio_morado_trapecio.jpg', 'cuadrado_azul_circulo.jpg', 'circulo_morado_pentagono.jpg', 'pentagono_azul_pentagono.jpg', 'pentagono_rosa_cuadrado.jpg', 'trapecio_rosa_cuadrado.jpg', 'cuadrado_morado_cuadrado.jpg', 'circulo_naranja_cuadrado.jpg']},
        { ruleParams: { feature1: 'fill', value1: 'cuadrado', feature2: 'color', value2: 'morado' }, gridStimuliIds: ['pentagono_morado_circulo.jpg', 'circulo_morado_cuadrado.jpg', 'trapecio_azul_cuadrado.jpg', 'cuadrado_morado_pentagono.jpg', 'circulo_azul_cuadrado.jpg', 'cuadrado_rosa_cuadrado.jpg', 'pentagono_azul_trapecio.jpg', 'trapecio_morado_trapecio.jpg', 'pentagono_naranja_cuadrado.jpg', 'cuadrado_naranja_trapecio.jpg', 'circulo_rosa_pentagono.jpg', 'trapecio_naranja_circulo.jpg', 'trapecio_rosa_pentagono.jpg', 'circulo_naranja_cuadrado.jpg', 'cuadrado_azul_pentagono.jpg', 'pentagono_rosa_cuadrado.jpg']},
        { ruleParams: { feature1: 'shape', value1: 'trapecio', feature2: 'fill', value2: 'trapecio' }, gridStimuliIds: ['pentagono_naranja_trapecio.jpg', 'trapecio_morado_circulo.jpg', 'cuadrado_morado_trapecio.jpg', 'circulo_azul_cuadrado.jpg', 'pentagono_rosa_circulo.jpg', 'trapecio_azul_pentagono.jpg', 'circulo_naranja_circulo.jpg', 'trapecio_rosa_trapecio.jpg', 'cuadrado_naranja_trapecio.jpg', 'circulo_rosa_trapecio.jpg', 'trapecio_naranja_cuadrado.jpg', 'pentagono_morado_pentagono.jpg', 'cuadrado_azul_trapecio.jpg', 'pentagono_azul_trapecio.jpg', 'cuadrado_rosa_pentagono.jpg', 'circulo_morado_trapecio.jpg']},
        { ruleParams: { feature1: 'color', value1: 'naranja', feature2: 'shape', value2: 'cuadrado' }, gridStimuliIds: ['cuadrado_naranja_pentagono.jpg', 'trapecio_azul_circulo.jpg', 'circulo_morado_pentagono.jpg', 'cuadrado_morado_cuadrado.jpg', 'circulo_naranja_cuadrado.jpg', 'cuadrado_azul_circulo.jpg', 'trapecio_rosa_trapecio.jpg', 'pentagono_naranja_circulo.jpg', 'pentagono_rosa_trapecio.jpg', 'pentagono_azul_cuadrado.jpg', 'circulo_rosa_circulo.jpg', 'trapecio_naranja_pentagono.jpg', 'cuadrado_rosa_trapecio.jpg', 'pentagono_morado_pentagono.jpg', 'trapecio_morado_cuadrado.jpg', 'circulo_azul_trapecio.jpg']},
        { ruleParams: { feature1: 'fill', value1: 'circulo', feature2: 'color', value2: 'rosa' }, gridStimuliIds: ['pentagono_azul_circulo.jpg', 'trapecio_morado_circulo.jpg', 'circulo_rosa_circulo.jpg', 'cuadrado_azul_trapecio.jpg', 'cuadrado_rosa_pentagono.jpg', 'circulo_morado_pentagono.jpg', 'cuadrado_naranja_circulo.jpg', 'pentagono_morado_cuadrado.jpg', 'trapecio_naranja_pentagono.jpg', 'pentagono_rosa_trapecio.jpg', 'circulo_naranja_circulo.jpg', 'trapecio_azul_circulo.jpg', 'cuadrado_morado_circulo.jpg', 'pentagono_naranja_circulo.jpg', 'circulo_azul_cuadrado.jpg', 'trapecio_rosa_circulo.jpg']},
        { ruleParams: { feature1: 'shape', value1: 'pentagono', feature2: 'fill', value2: 'pentagono' }, gridStimuliIds: ['pentagono_azul_cuadrado.jpg', 'pentagono_naranja_trapecio.jpg', 'circulo_morado_cuadrado.jpg', 'cuadrado_morado_pentagono.jpg', 'pentagono_rosa_pentagono.jpg', 'circulo_naranja_pentagono.jpg', 'trapecio_azul_pentagono.jpg', 'trapecio_morado_trapecio.jpg', 'trapecio_naranja_circulo.jpg', 'circulo_rosa_pentagono.jpg', 'cuadrado_naranja_pentagono.jpg', 'pentagono_morado_circulo.jpg', 'cuadrado_rosa_circulo.jpg', 'circulo_azul_pentagono.jpg', 'trapecio_rosa_pentagono.jpg', 'cuadrado_azul_trapecio.jpg']},
        { ruleParams: { feature1: 'color', value1: 'morado', feature2: 'shape', value2: 'circulo' }, gridStimuliIds: ['cuadrado_morado_pentagono.jpg', 'circulo_morado_cuadrado.jpg', 'circulo_rosa_pentagono.jpg', 'trapecio_morado_circulo.jpg', 'pentagono_rosa_circulo.jpg', 'cuadrado_naranja_circulo.jpg', 'trapecio_azul_trapecio.jpg', 'pentagono_naranja_cuadrado.jpg', 'circulo_azul_circulo.jpg', 'trapecio_naranja_pentagono.jpg', 'pentagono_azul_pentagono.jpg', 'cuadrado_rosa_trapecio.jpg', 'circulo_naranja_trapecio.jpg', 'cuadrado_azul_pentagono.jpg', 'pentagono_morado_trapecio.jpg', 'trapecio_rosa_cuadrado.jpg']}
    ]
}; 


// --- VARIABLES DE ESTADO (INICIALIZADAS GLOBALMENTE) --------------------------------------------------------------
let participantData = {
    id: null,
    group: null,
    demographics: {},
    trials: [],
    trialCountersByRuleType: {} 
};
let currentTrialData = {};
let currentScreen = 'demographics';
let currentGroupRuleOrder = [];
let currentRuleTypeIndex = 0;
let trialsInCurrentRule = 0;
let totalTrialsCompleted = 0;
let currentGridStimuli = [];
let currentRule = null;
let selectedItemsIndices = new Set();
let experimentStartTime = null;
let ALL_STIMULI = [];
let currentPredefinedTrialConfig = null;

// --- REFERENCIAS A ELEMENTOS DEL DOM (GLOBALES PARA ACCESO FÁCIL) ------------------------------------------------
// Estas se asignarán en window.onload para asegurar que el DOM esté listo
let demographicsScreenEl, instructionsScreenEl, taskScreenEl, finalQuestionsScreenEl, thankYouScreenEl;
let gridContainerEl, historyListEl, testButtonEl, selectButtonEl, confidenceSliderEl,
    confidenceValueDisplayEl, feedbackMessageEl, trialCounterDisplayEl, currentRuleTypeDisplayEl,
    currentRuleParamsDisplayEl;
let demographicsFormEl, startTaskButtonEl, finalQuestionsFormEl;

// Objeto SCREENS que se llenará en window.onload
let SCREENS_OBJ;

// --- Guardado de datos -------------------------------------------------------------------------------------------
const BACKEND_SUBMIT_URL = '/.netlify/functions/submit_data'; // Ruta estándar para Netlify Functions

// --- FUNCIONES ---------------------------------------------------------------------------------------------------

function generateAllStimuli() {
    ALL_STIMULI = []; // Resetear
    for (const shape of SHAPES) {
        for (const color of COLORS) {
            for (const fill of FILLS) {
                const stimulusId = `${shape}_${color}_${fill}.jpg`;
                ALL_STIMULI.push({
                    id: stimulusId,
                    shape: shape,
                    color: color,
                    fill: fill,
                    imageName: stimulusId
                });
            }
        }
    }
}

function createGetRelevantStimuliFunction(ruleTypeName, params) {
    switch (ruleTypeName) {
        case RULE_TYPES.SPECIFIC:
            return (gridItems) => gridItems.filter(item => {
                let match = true;
                if (params.shape && item.shape !== params.shape) match = false;
                if (params.color && item.color !== params.color) match = false;
                if (params.fill && item.fill !== params.fill) match = false;
                return match;
            });
        case RULE_TYPES.FEATURE_BASED:
            return (gridItems) => gridItems.filter(item => item[params.feature] === params.value);
        case RULE_TYPES.RELATIONAL:
            switch (params.subType) {
                case 'exact_one':
                    return (gridItems) => {
                        const matching = gridItems.filter(item => item[params.feature] === params.value);
                        return matching.length === 1 ? matching : [];
                    };
                case 'share_two':
                    return (gridItems) => {
                        const matching = gridItems.filter(item => item[params.feature] === params.value);
                        return matching.length === 2 ? matching : [];
                    };
                case 'all_except_one':
                    return (gridItems) => {
                        const matching = gridItems.filter(item => item[params.feature] === params.value);
                        const nonMatching = gridItems.filter(item => item[params.feature] !== params.value);
                        return nonMatching.length === 1 && matching.length === (CONFIG.gridSize - 1) ? matching : [];
                    };
                default: // Añadir un default para el switch interno
                    console.error("Subtipo relacional no reconocido:", params.subType);
                    return () => []; 
            }
            break; // Este break faltaba para el case RULE_TYPES.RELATIONAL
        case RULE_TYPES.CONJUNCTIVE:
            return (gridItems) => gridItems.filter(item =>
                (item[params.feature1] === params.value1) || (item[params.feature2] === params.value2)
            );
        default: // Añadir un default para el switch externo
            console.error("Tipo de regla desconocido en createGetRelevantStimuliFunction:", ruleTypeName, params);
            return () => [];
    }
}

function showScreen(screenName) {
    console.log(`[showScreen] Intentando mostrar: ${screenName}`);
    if (!SCREENS_OBJ) {
        console.error("[showScreen] Objeto SCREENS_OBJ no inicializado.");
        return;
    }

    Object.values(SCREENS_OBJ).forEach(screen => {
        if (screen) {
            screen.classList.remove('active');
        } else {
            // Esto puede ocurrir si una de las pantallas no se encontró y es null en SCREENS_OBJ
            // console.warn("[showScreen] Un elemento de pantalla es null en SCREENS_OBJ durante remove('active').");
        }
    });

    const screenToShow = SCREENS_OBJ[screenName];

    if (screenToShow) {
        screenToShow.classList.add('active');
        currentScreen = screenName;
        console.log(`[showScreen] Pantalla cambiada a: ${currentScreen}.`);
    } else {
        console.error(`[showScreen] Elemento del DOM para la pantalla '${screenName}' (clave: ${screenName}) no encontrado en SCREENS_OBJ o es null.`);
    }
}

function generateParticipantID() { return Math.floor(1000 + Math.random() * 9000).toString(); }

function assignGroupAndRuleOrder() {
    console.log("[assignGroupAndRuleOrder] Iniciando.");
    const groupNumber = Math.floor(Math.random() * 4) + 1;
    participantData.group = groupNumber;
    switch (groupNumber) {
        case 1: currentGroupRuleOrder = [RULE_TYPES.SPECIFIC, RULE_TYPES.FEATURE_BASED, RULE_TYPES.RELATIONAL, RULE_TYPES.CONJUNCTIVE]; break;
        case 2: currentGroupRuleOrder = [RULE_TYPES.FEATURE_BASED, RULE_TYPES.RELATIONAL, RULE_TYPES.CONJUNCTIVE, RULE_TYPES.SPECIFIC]; break;
        case 3: currentGroupRuleOrder = [RULE_TYPES.RELATIONAL, RULE_TYPES.CONJUNCTIVE, RULE_TYPES.SPECIFIC, RULE_TYPES.FEATURE_BASED]; break;
        case 4: currentGroupRuleOrder = [RULE_TYPES.CONJUNCTIVE, RULE_TYPES.SPECIFIC, RULE_TYPES.FEATURE_BASED, RULE_TYPES.RELATIONAL]; break;
    }
    participantData.trialCountersByRuleType = {
        [RULE_TYPES.SPECIFIC]: 0, [RULE_TYPES.FEATURE_BASED]: 0,
        [RULE_TYPES.RELATIONAL]: 0, [RULE_TYPES.CONJUNCTIVE]: 0
    };
    console.log("[assignGroupAndRuleOrder] Finalizado. Grupo:", groupNumber, "Orden:", currentGroupRuleOrder);
}

function getTimestamp() { return experimentStartTime ? Date.now() - experimentStartTime : Date.now(); }

function initializeTask() { 
    currentRuleTypeIndex = 0;
    trialsInCurrentRule = 0;
    totalTrialsCompleted = 0;
    participantData.trials = [];
    startNewTrial();
}

function startNewTrial() { 
    totalTrialsCompleted++;
    if (totalTrialsCompleted > CONFIG.numTrialsPerRule * CONFIG.totalRuleTypes) {
        endExperiment();
        return;
    }
    if (trialsInCurrentRule >= CONFIG.numTrialsPerRule) {
        trialsInCurrentRule = 0;
        currentRuleTypeIndex++;
        if (currentRuleTypeIndex >= currentGroupRuleOrder.length) {
            console.error("Índice de tipo de regla excedido inesperadamente en startNewTrial.");
            endExperiment(); return;
        }
    }
    trialsInCurrentRule++;
    const currentRuleTypeNameInGroupOrder = currentGroupRuleOrder[currentRuleTypeIndex];
    let trialIndexForPredefinedSetup = trialsInCurrentRule - 1;
    
    if (!PREDEFINED_TRIALS_SETUP[currentRuleTypeNameInGroupOrder] || !PREDEFINED_TRIALS_SETUP[currentRuleTypeNameInGroupOrder][trialIndexForPredefinedSetup]) {
        console.error(`Configuración de ensayo PREDEFINIDA no encontrada para: ${currentRuleTypeNameInGroupOrder}, índice ${trialIndexForPredefinedSetup}`);
        endExperiment(); return;
    }
    currentPredefinedTrialConfig = PREDEFINED_TRIALS_SETUP[currentRuleTypeNameInGroupOrder][trialIndexForPredefinedSetup];

    currentTrialData = {
        trialNumber: totalTrialsCompleted, ruleType: currentRuleTypeNameInGroupOrder,
        ruleParams: JSON.parse(JSON.stringify(currentPredefinedTrialConfig.ruleParams)),
        gridConfigurationIds: [...currentPredefinedTrialConfig.gridStimuliIds],
        actions: [], startTime: getTimestamp(), endTime: null, correctlySolved: false
    };
    currentRule = {
        type: currentTrialData.ruleType, params: currentTrialData.ruleParams,
        description: `Ensayo ${totalTrialsCompleted}: ${currentTrialData.ruleType}`,
        getRelevantStimuli: createGetRelevantStimuliFunction(currentTrialData.ruleType, currentTrialData.ruleParams)
    };
    
    if (currentRuleTypeDisplayEl) currentRuleTypeDisplayEl.textContent = `${currentTrialData.ruleType}`;
    if (currentRuleParamsDisplayEl) currentRuleParamsDisplayEl.textContent = `Parámetros Regla: ${JSON.stringify(currentTrialData.ruleParams, null, 2)}`;
    
    renderGrid(); clearSelection(); clearHistory(); updateTrialCounter();
    if (feedbackMessageEl) feedbackMessageEl.textContent = '';
    if (confidenceSliderEl) confidenceSliderEl.value = 0; 
    if (confidenceValueDisplayEl) confidenceValueDisplayEl.textContent = '0'; 
    if (selectButtonEl) selectButtonEl.disabled = true;

    // Habilitar botones al final de la configuración del nuevo ensayo
    setActionButtonsDisabled(false); // Esto habilitará test y select (si confianza > 0)
    if (selectButtonEl) selectButtonEl.disabled = parseInt(confidenceSliderEl.value) === 0; // Asegurar estado correcto de select
}

function renderGrid() { 
    if (!gridContainerEl) { console.error("gridContainerEl no encontrado."); return; }
    gridContainerEl.innerHTML = '';
    selectedItemsIndices.clear();
    if (!currentPredefinedTrialConfig || !currentPredefinedTrialConfig.gridStimuliIds) {
        console.error("Error: No config de grid en renderGrid."); gridContainerEl.textContent = "Error."; return;
    }
    currentGridStimuli = currentPredefinedTrialConfig.gridStimuliIds.map(id => {
        const stimulus = ALL_STIMULI.find(s => s.id === id);
        if (!stimulus) console.error(`Estímulo ID '${id}' no encontrado.`);
        return stimulus;
    }).filter(s => s);
    currentTrialData.gridConfiguration = [...currentPredefinedTrialConfig.gridStimuliIds];
    currentGridStimuli.forEach((stimulus, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('grid-item');
        itemDiv.dataset.index = index; itemDiv.dataset.stimulusId = stimulus.id;
        const img = document.createElement('img');
        img.src = `${CONFIG.imagePath}${stimulus.imageName}`;
        img.alt = stimulus.id.replace(/_/g, ' ').replace(/\.jpg/i, '');
        itemDiv.appendChild(img);
        itemDiv.addEventListener('click', () => handleGridItemClick(index, itemDiv, stimulus));
        gridContainerEl.appendChild(itemDiv);
    });
}

function handleGridItemClick(index, itemDiv, stimulus) { 
    if (!stimulus) { console.error("Estímulo no definido en handleGridItemClick"); return; }
    const actionTime = getTimestamp(); let actionType;
    if (selectedItemsIndices.has(index)) {
        selectedItemsIndices.delete(index); itemDiv.classList.remove('selected'); actionType = 'deselect_item';
    } else {
        selectedItemsIndices.add(index); itemDiv.classList.add('selected'); actionType = 'select_item';
    }
    if (currentTrialData && currentTrialData.actions) {
        currentTrialData.actions.push({
            actionType: actionType, time: actionTime, itemIndex: index, itemId: stimulus.id,
            itemFeatures: { shape: stimulus.shape, color: stimulus.color, fill: stimulus.fill }
        });
    }
}

function clearSelection() { 
    selectedItemsIndices.clear();
    document.querySelectorAll('.grid-item.selected').forEach(el => el.classList.remove('selected'));
}

function updateHistory(selectedStimuli, isCorrect, type) { 
    if(!historyListEl) return;
    const li = document.createElement('li');
    const icon = document.createElement('span');
    icon.textContent = isCorrect ? '✓ ' : '✗ '; icon.style.color = isCorrect ? 'green' : 'red';
    li.appendChild(icon);
    const stimuliSpan = document.createElement('span');
    stimuliSpan.classList.add('history-item-stimuli');
    if (selectedStimuli.length > 0) {
        selectedStimuli.slice(0, 5).forEach(stimulus => {
            const img = document.createElement('img');
            img.src = `${CONFIG.imagePath}${stimulus.imageName}`;
            img.alt = stimulus.id.substring(0,3); stimuliSpan.appendChild(img);
        });
        if (selectedStimuli.length > 5) stimuliSpan.appendChild(document.createTextNode(`...y ${selectedStimuli.length - 5} más`));
    } else { stimuliSpan.textContent = "[Ninguna selección]"; }
    li.appendChild(stimuliSpan); li.appendChild(document.createTextNode(` (${type})`));
    historyListEl.prepend(li);
    if (historyListEl.children.length > 10) historyListEl.removeChild(historyListEl.lastChild);
}

function clearHistory() { if(historyListEl) historyListEl.innerHTML = ''; }

function showFeedback(message, typeClass) { 
    if(!feedbackMessageEl) return;
    feedbackMessageEl.textContent = message; feedbackMessageEl.className = 'feedback-message';
    if (typeClass) feedbackMessageEl.classList.add(typeClass);
    setTimeout(() => {
        if (feedbackMessageEl.textContent === message) {
            feedbackMessageEl.textContent = ''; feedbackMessageEl.className = 'feedback-message';
        }
    }, 3000);
}

function updateTrialCounter() { 
    if(!trialCounterDisplayEl) return;
    trialCounterDisplayEl.textContent = `${totalTrialsCompleted}/${CONFIG.numTrialsPerRule * CONFIG.totalRuleTypes}`;
}

function setActionButtonsDisabled(disabledState) {

    if (testButtonEl) {
        testButtonEl.disabled = disabledState === true; // Deshabilitar Test solo si disabledState es true explícito
    }
    if (selectButtonEl && confidenceSliderEl) {
        if (disabledState === true) {
            selectButtonEl.disabled = true;
        } else { // Si es false (habilitar)
            selectButtonEl.disabled = parseInt(confidenceSliderEl.value) === 0;
        }
    } else if (selectButtonEl) { // Fallback si confidenceSliderEl no existe
        selectButtonEl.disabled = disabledState === true;
    }
}

function endExperiment() { 
    if (currentTrialData && currentTrialData.startTime && !currentTrialData.endTime && totalTrialsCompleted <= CONFIG.numTrialsPerRule * CONFIG.totalRuleTypes) {
        currentTrialData.endTime = getTimestamp(); currentTrialData.correctlySolved = false; 
        participantData.trials.push({...currentTrialData});
    }
    console.log("Fin del experimento, mostrando pantalla de preguntas finales.");
    showScreen('finalQuestions'); 
}

async function saveDataToServer() { // Cambiado el nombre y hecho async
    if (!participantData || !participantData.id) {
        console.error("No hay datos de participante para enviar.");
        // Podrías intentar guardarlo localmente como fallback si es crítico
        // downloadDataAsCSV_LocalFallback(); 
        return;
    }

    console.log("Preparando datos para enviar al servidor:", participantData);

    try {
        console.log("Enviando datos a:", BACKEND_SUBMIT_URL); // Para depuración
        const response = await fetch(BACKEND_SUBMIT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ participantData: participantData }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Datos enviados exitosamente al servidor:", result.message);
            // Puedes dejar que el servidor maneje el agradecimiento, o el cliente
            // showScreen('thankYouScreen'); // Si el servidor no redirige
        } else {
            console.error("Error al enviar datos al servidor:", result.message);
            alert("Hubo un error al guardar tus datos en el servidor. Por favor, intenta descargar una copia local.");
            downloadDataAsCSV_LocalFallback(); // Intenta descargar localmente como respaldo
        }
    } catch (error) {
        console.error("Error de red o al conectar con el servidor:", error);
        alert("No se pudieron enviar los datos al servidor debido a un problema de red. Por favor, intenta descargar una copia local.");
        downloadDataAsCSV_LocalFallback(); // Intenta descargar localmente como respaldo
    }
}

// Mantén tu función original de descarga local como un respaldo
function downloadDataAsCSV_LocalFallback() {
    if (!participantData || !participantData.id) {
        console.error("No hay datos de participante para descargar localmente.");
        return;
    }
    // ... (tu lógica existente para crear el CSV y el enlace de descarga) ...
    // Esta es la función downloadDataAsCSV que ya tenías, solo renombrada
    let csvContent = "data:text/csv;charset=utf-8,";
    const pHeaders = ["participant_id", "group", "age", "education", "occupation", "state_origin", "marital_status"];
    csvContent += pHeaders.join(",") + "\n";
    const pRow = [participantData.id, participantData.group, participantData.demographics.age, participantData.demographics.education, participantData.demographics.occupation, participantData.demographics.stateOrigin, participantData.demographics.maritalStatus];
    csvContent += pRow.join(",") + "\n\n";
    
    const finalQuestionsHeaders = participantData.finalQuestions ? Object.keys(participantData.finalQuestions) : [];
    if (finalQuestionsHeaders.length > 0) {
        csvContent += finalQuestionsHeaders.join(",") + "\n";
        const finalQuestionsRow = finalQuestionsHeaders.map(key => participantData.finalQuestions[key]);
        csvContent += finalQuestionsRow.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",") + "\n\n";
    }

    const tHeaders = ["participant_id", "trial_number", "rule_type", "rule_param_shape", "rule_param_color", "rule_param_fill", "rule_param_feature", "rule_param_value", "rule_param_feature1", "rule_param_value1", "rule_param_feature2", "rule_param_value2", "rule_param_subtype", "grid_configuration_ids", "action_sequence_in_trial", "action_type", "action_time_ms", "selected_item_index", "selected_item_id", "selected_item_shape", "selected_item_color", "selected_item_fill", "tested_selection_ids", "is_test_any_item_relevant", "final_selection_ids", "is_final_selection_correct", "confidence", "trial_start_time_ms", "trial_end_time_ms", "trial_correctly_solved"];
    csvContent += tHeaders.join(",") + "\n";
    participantData.trials.forEach(trial => {
        if (!trial.actions || trial.actions.length === 0) {
            let row = [participantData.id, trial.trialNumber, trial.ruleType, trial.ruleParams?.shape || '', trial.ruleParams?.color || '', trial.ruleParams?.fill || '', trial.ruleParams?.feature || '', trial.ruleParams?.value || '', trial.ruleParams?.feature1 || '', trial.ruleParams?.value1 || '', trial.ruleParams?.feature2 || '', trial.ruleParams?.value2 || '', trial.ruleParams?.subType || '', (trial.gridConfigurationIds || []).join(';'), 0, 'NO_ACTIONS', '', '', '', '', '', '', '', '', '', '', '', '', trial.startTime, trial.endTime, trial.correctlySolved];
            csvContent += row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",") + "\n";
        } else {
            trial.actions.forEach((action, actionIndex) => {
                let row = [participantData.id, trial.trialNumber, trial.ruleType, trial.ruleParams?.shape || '', trial.ruleParams?.color || '', trial.ruleParams?.fill || '', trial.ruleParams?.feature || '', trial.ruleParams?.value || '', trial.ruleParams?.feature1 || '', trial.ruleParams?.value1 || '', trial.ruleParams?.feature2 || '', trial.ruleParams?.value2 || '', trial.ruleParams?.subType || '', (trial.gridConfigurationIds || []).join(';'), actionIndex + 1, action.actionType, action.time];
                if (action.actionType === 'select_item' || action.actionType === 'deselect_item') {
                    row.push(action.itemIndex, action.itemId, action.itemFeatures.shape, action.itemFeatures.color, action.itemFeatures.fill, '', '', '', '', action.confidence || '');
                } else if (action.actionType === 'test') {
                    row.push('', '', '', '', '', (action.selection || []).join(';'), action.isAnyItemInSelectionRelevant, '', '', '');
                } else if (action.actionType === 'final_select') {
                    row.push('', '', '', '', '', '', '', (action.selection || []).join(';'), action.isCorrectFull, action.confidence);
                } else { row.push('', '', '', '', '', '', '', '', '', ''); }
                row.push(trial.startTime, trial.endTime, trial.correctlySolved);
                csvContent += row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",") + "\n";
            });
        }
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `experiment_data_P${participantData.id}_G${participantData.group}_LOCAL_BACKUP.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    console.log("Copia local de respaldo descargada.");
}


// --- INICIALIZACIÓN DEL EXPERIMENTO Y EVENT LISTENERS ---
window.onload = () => {
    console.log("--- Window Onload ---");

    // ASIGNAR REFERENCIAS A ELEMENTOS DEL DOM GLOBALES
    demographicsScreenEl = document.getElementById('demographicsScreen');
    instructionsScreenEl = document.getElementById('instructionsScreen');
    taskScreenEl = document.getElementById('taskScreen');
    finalQuestionsScreenEl = document.getElementById('finalQuestionsScreen');
    thankYouScreenEl = document.getElementById('thankYouScreen');

    console.log("Elemento finalQuestionsScreenEl en onload:", finalQuestionsScreenEl); 
    if (!finalQuestionsScreenEl) {
        console.error("¡¡¡ERROR CRÍTICO EN ONLOAD: finalQuestionsScreen NO FUE ENCONTRADO EN EL DOM!!!");
    }

    SCREENS_OBJ = {
        demographics: demographicsScreenEl,
        instructions: instructionsScreenEl,
        task: taskScreenEl,
        finalQuestions: finalQuestionsScreenEl, 
        thankYou: thankYouScreenEl,
    };
    gridContainerEl = document.getElementById('gridContainer');
    historyListEl = document.getElementById('historyList');
    testButtonEl = document.getElementById('testButton');
    selectButtonEl = document.getElementById('selectButton');
    confidenceSliderEl = document.getElementById('confidenceSlider');
    confidenceValueDisplayEl = document.getElementById('confidenceValue');
    feedbackMessageEl = document.getElementById('feedbackMessage');
    trialCounterDisplayEl = document.getElementById('trialCounter');
    currentRuleTypeDisplayEl = document.getElementById('currentRuleTypeDisplay');
    currentRuleParamsDisplayEl = document.getElementById('currentRuleParamsDisplay');

    demographicsFormEl = document.getElementById('demographicsForm');
    startTaskButtonEl = document.getElementById('startTaskButton');
    finalQuestionsFormEl = document.getElementById('finalQuestionsForm');

    // Validar elementos cruciales
    if (!demographicsFormEl || !startTaskButtonEl || !finalQuestionsFormEl || !testButtonEl || !selectButtonEl ||
        !demographicsScreenEl || !instructionsScreenEl || !taskScreenEl || !finalQuestionsScreenEl || !thankYouScreenEl ||
        !gridContainerEl || !historyListEl /*... y otros que consideres esenciales ...*/) {
        console.error("¡ALERTA CRÍTICA! Uno o más elementos del DOM esenciales no fueron encontrados. Verifica los IDs en tu HTML.");
        // alert("Error crítico al cargar el experimento. El experimento no puede continuar. Por favor, revisa la consola y contacta al administrador.");
        // return; // Detener si falta algo esencial
    }

    try {
        generateAllStimuli();
        console.log("ALL_STIMULI generados, cantidad:", ALL_STIMULI.length);
        
        demographicsFormEl.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log("--- Formulario Demográfico Enviado ---");
            try {
                participantData.id = generateParticipantID();
                participantData.demographics.age = document.getElementById('age').value;
                participantData.demographics.education = document.getElementById('education').value;
                participantData.demographics.occupation = document.getElementById('occupation').value;
                participantData.demographics.stateOrigin = document.getElementById('stateOrigin').value;
                participantData.demographics.maritalStatus = document.getElementById('maritalStatus').value;
                assignGroupAndRuleOrder();
                showScreen('instructions');
            } catch (e) { console.error("Error en listener de demographicsForm:", e); }
        });

        startTaskButtonEl.addEventListener('click', function() {
            console.log("--- Botón 'Comenzar Tarea' Clickeado ---");
            try {
                experimentStartTime = Date.now();
                initializeTask();
                showScreen('task');
            } catch (e) { console.error("Error en listener de startTaskButton:", e); }
        });

        if (finalQuestionsFormEl) { // Asegúrate que finalQuestionsFormEl esté definido
            finalQuestionsFormEl.addEventListener('submit', async function(event) { // Haz el listener async
                event.preventDefault();
                console.log("Enviando respuestas finales...");
                try {
                    // ... (tu lógica para recolectar respuestas de preguntas finales) ...
                    const foundCategories = Array.from(document.querySelectorAll('input[name="found_category"]:checked')).map(cb => cb.value);
                    const mostFoundCategories = Array.from(document.querySelectorAll('input[name="most_found_category"]:checked')).map(cb => cb.value);
                    const strategy_used = Array.from(document.querySelectorAll('input[name="strategy_used"]:checked')).map(cb => cb.value);
                    const difficulty_overall_el = document.getElementById('difficulty_overall');
                    
                    participantData.finalQuestions = {
                        foundCategories: foundCategories.join(', '),
                        mostFoundCategories: mostFoundCategories.join(', '),
                        difficultyOverall: difficulty_overall_el ? difficulty_overall_el.value : 'N/A',
                        strategy_used: strategy_used.join(', '),
                    };
                    console.log("Respuestas finales para enviar:", participantData.finalQuestions);

                    await saveDataToServer(); // Llama a la función para enviar al servidor
                    showScreen('thankYou'); // Muestra agradecimiento después de intentar enviar
                } catch (e) { 
                    console.error("Error en listener de finalQuestionsForm:", e); 
                    alert("Ocurrió un error al procesar las respuestas finales. Se intentará descargar una copia local.");
                    downloadDataAsCSV_LocalFallback(); // Fallback si hay error aquí
                    showScreen('thankYou'); // Igual muestra agradecimiento
                }
            });
        }
        
        testButtonEl.addEventListener('click', () => { 
            if (selectedItemsIndices.size === 0) { showFeedback("Debes seleccionar al menos un ítem para probar.", 'incorrect'); return; }
            const actionTime = getTimestamp();
            showFeedback(`Probando...`, ''); 

            const currentSelectedStimuliObjects = Array.from(selectedItemsIndices).map(i => currentGridStimuli[i]);
            let isAnyItemInSelectionRelevant = false;
            if (!currentRule || typeof currentRule.getRelevantStimuli !== 'function') {
                console.error("Error: currentRule o getRelevantStimuli no definido."); showFeedback("Error interno.", 'incorrect'); 
                return;
            }
            const targetStimuliObjectsForRule = currentRule.getRelevantStimuli(currentGridStimuli);
            if (currentSelectedStimuliObjects.length > 0) {
                for (const selectedStimulus of currentSelectedStimuliObjects) {
                    if (targetStimuliObjectsForRule.some(target => target.id === selectedStimulus.id)) { isAnyItemInSelectionRelevant = true; break; }
                }
            }
            updateHistory(currentSelectedStimuliObjects, isAnyItemInSelectionRelevant, 'test');
            showFeedback(isAnyItemInSelectionRelevant ? "Algún ítem seleccionado es relevante." : "Ningún ítem seleccionado parece relevante.", isAnyItemInSelectionRelevant ? 'correct' : 'incorrect');
            if (currentTrialData && currentTrialData.actions) {
                currentTrialData.actions.push({ actionType: 'test', time: actionTime, selection: currentSelectedStimuliObjects.map(s => s.id), selectionFeatures: currentSelectedStimuliObjects.map(s => ({ shape: s.shape, color: s.color, fill: s.fill })), isAnyItemInSelectionRelevant: isAnyItemInSelectionRelevant, penaltyApplied: CONFIG.penalties.test });
            }
        });

        selectButtonEl.addEventListener('click', () => { 
            if (selectButtonEl.disabled) return; 
            
            const confidence = parseInt(confidenceSliderEl.value);
            if (confidence === 0) { 
                showFeedback("Debes indicar tu nivel de confianza (1-5).", 'incorrect'); 
                return; 
            }
            if (!currentRule || typeof currentRule.getRelevantStimuli !== 'function') {
                console.error("Error: currentRule o getRelevantStimuli no definido."); 
                showFeedback("Error interno.", 'incorrect'); 
                return;
            }
            const targetStimuliForSelect = currentRule.getRelevantStimuli(currentGridStimuli);
            if (selectedItemsIndices.size === 0 && targetStimuliForSelect.length > 0) { 
                showFeedback("Debes seleccionar los ítems que crees que cumplen la regla.", 'incorrect'); 
                return; 
            }
            
            const actionTime = getTimestamp();
            showFeedback(`Verificando...`, '');
            
            const currentSelectedStimuliObjects = Array.from(selectedItemsIndices).map(i => currentGridStimuli[i]);
            const currentSelectedStimuliIds = new Set(currentSelectedStimuliObjects.map(s => s.id));
            const targetStimuliIds = new Set(targetStimuliForSelect.map(s => s.id));
            let isSelectionCorrect = currentSelectedStimuliIds.size === targetStimuliIds.size && [...currentSelectedStimuliIds].every(id => targetStimuliIds.has(id));
            
            if (currentTrialData && currentTrialData.actions) {
                currentTrialData.actions.push({ actionType: 'final_select', time: actionTime, selection: currentSelectedStimuliObjects.map(s => s.id), selectionFeatures: currentSelectedStimuliObjects.map(s => ({ shape: s.shape, color: s.color, fill: s.fill })), isCorrectFull: isSelectionCorrect, confidence: confidence, penaltyApplied: CONFIG.penalties.select });
            }
            updateHistory(currentSelectedStimuliObjects, isSelectionCorrect, 'select');

            // Solo deshabilitar si la selección va a ser CORRECTA (para prevenir doble avance)
            // Si es incorrecta, los botones permanecerán activos.
            if (isSelectionCorrect) {
                setActionButtonsDisabled(true); // Deshabilitar AMBOS botones AHORA
                showFeedback("¡Correcto! Pasando al siguiente ensayo.", 'correct');
                if (currentTrialData) {
                    currentTrialData.correctlySolved = true; 
                    currentTrialData.endTime = getTimestamp();
                }
                participantData.trials.push({...currentTrialData});
                setTimeout(() => { 
                    startNewTrial(); // startNewTrial rehabilitará los botones
                }, 1500); // Delay para leer feedback
            } else {
                showFeedback("No has seleccionado los elementos específicos de esta categoría.", 'incorrect');
                // NO deshabilitar botones aquí si la selección es incorrecta
                // setActionButtonsDisabled(false) implícitamente ya que no se llamó a true
            }
        });

        confidenceSliderEl.addEventListener('input', (event) => { 
            const value = parseInt(event.target.value);
            if (confidenceValueDisplayEl) confidenceValueDisplayEl.textContent = value;
            // Solo re-evaluar el estado del botón de selección. testButton no se ve afectado por esto.
            if (selectButtonEl) {
                selectButtonEl.disabled = (value === 0);
            }
        });
        showScreen('demographics');
        console.log("Mostrando pantalla de demográficos. Pantalla actual:", currentScreen);
        if (selectButtonEl) selectButtonEl.disabled = true;

    } catch (error) {
        console.error("ERROR GENERAL EN WINDOW.ONLOAD:", error);
        alert("Ocurrió un error al inicializar el experimento. Por favor, revisa la consola.");
    }
};
