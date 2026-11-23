# Storyboard — El Dashboard que Convence

## Pregunta narrativa central

> ¿Dónde el acceso a electricidad sigue siendo una deuda pendiente en Latinoamérica al 2024?

## Conclusión / tensión (título del dashboard)

**«Casi toda Latinoamérica tiene luz. Haití todavía no.»**

## Paleta elegida: Paleta 1 — Sostenibilidad

Referencia: [coolors.co/palette/264653-2a9d8f-e9c46a-f4a261-e76f51](https://coolors.co/palette/264653-2a9d8f-e9c46a-f4a261-e76f51)

| Color | Hex | Intención |
|-------|-----|-----------|
| Primario (dato principal) | `#2A9D8F` | Acceso a electricidad de la región; esperanza/sostenibilidad. |
| Neutro oscuro (estructura) | `#264653` | Títulos, ejes y contexto; ancla visual sin competir con el hallazgo. |
| Acento (hallazgo clave) | `#E76F51` | Haití y la deuda pendiente; tensión narrativa. |
| Secundario (contexto) | `#8A9A9D` / grises | Mediana regional y países de referencia; no distraer del mensaje. |

Máximo cuatro colores activos por vista: primario, acento, neutro oscuro y gris de contexto.

## Flujo narrativo de visualizaciones

### 1. Ranking de acceso a electricidad (posición principal)

- **Por qué primero:** abre con el contraste brutal: 19 países cerca del 100% vs Haití ~54%.
- **Mensaje:** el acceso ya no es un problema “regional”; es un problema concentrado.
- **Anotación:** «Haití: 53,9% — casi la mitad de la población sin acceso (2024)».

### 2. Trayectoria 2000–2024: Haití vs mediana LatAm

- **Mensaje:** Haití avanza, pero demasiado lento; la brecha con la mediana regional se mantiene enorme.
- **Conexión:** después de ver el ranking, el lector pregunta “¿está mejorando?”; esta serie responde.

### 3. Electricidad renovable vs acceso (snapshot)

- **Mensaje:** cerrar el acceso y limpiar la matriz son batallas distintas: Costa Rica/Paraguay ya son ~100% renovables en electricidad, mientras Haití acumula rezago en ambos frentes.
- **Conexión:** cierra con la implicación para donantes: financiar acceso en Haití y no asumir que “LatAm ya está resuelta”.

## Dataset

- Fuente base: Our World in Data / Kaggle World Energy Consumption (`owid-energy-data.csv`).
- Complementos OWID: acceso a electricidad y `co2_per_capita`.
- Filtro: 20 países de América Latina, años ≥ 2000.
- Archivo limpio: `data/latam_energy_clean.csv` (lectura directa, sin hardcodeo de métricas en los visuales).
