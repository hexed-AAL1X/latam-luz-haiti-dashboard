# Fase 2 — Exploración y limpieza

## Cobertura y nulos (LatAm, year ≥ 2000)

| Columna | Observación |
|---------|-------------|
| access_to_electricity | ~2.5% nulos; cobertura amplia 2000–2024 |
| renewables_share_energy | cobertura parcial (~8 países BP) |
| renewables_share_elec | cobertura completa (20 países) — usada en visual 3 |
| energy_per_capita | buena cobertura |
| co2_per_capita | cobertura completa vía OWID CO₂ |
| gdp | ~10% nulos |

## Filtrado

- 20 países de América Latina
- Años desde 2000
- Archivo resultante: `data/latam_energy_clean.csv`

## Métricas derivadas

- `gdp_per_capita = gdp / population`
- Uso de `renewables_share_elec` como proxy robusto de energía limpia en electricidad (mejor cobertura que `renewables_share_energy`)

## Tres gráficos propuestos

1. Barras horizontales de acceso (ranking) — hallazgo Haití
2. Series temporales Haití vs mediana LatAm (+ vecinos)
3. Dispersión acceso × electricidad renovable

## Contexto para anotaciones

- Haití 2024: ~53.9% acceso (casi la mitad sin electricidad)
- Mediana regional cercana a cobertura universal
- Costa Rica / Paraguay: ~100% electricidad renovable
