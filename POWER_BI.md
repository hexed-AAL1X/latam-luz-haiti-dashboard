# Construcción equivalente en Power BI (VM Windows)

La entrega pública ya está como página web (requisito indispensable del URL).
Si el docente exige también el `.pbix`, usa la VM Win10 con estos pasos:

1. Copia `data/latam_energy_clean.csv` a la VM (carpeta compartida `pe-share`).
2. Power BI Desktop → Obtener datos → Texto/CSV → selecciona el archivo (lectura directa).
3. Tres visuales:
   - Barras: `country` vs `access_to_electricity` (último año) — color condicional Haití `#E76F51`.
   - Líneas: acceso por `year` para Haití + mediana LatAm.
   - Dispersión: `access_to_electricity` (eje X) vs `renewables_share_elec` (eje Y).
4. Título narrativo: **Casi toda Latinoamérica tiene luz. Haití todavía no.**
5. Anotación de texto sobre el visual de ranking con el hallazgo de Haití 53,9%.
6. Publicar en Power BI Service → *Publish to web* (si la cuenta lo permite).

Paleta Sostenibilidad: `#264653` `#2A9D8F` `#E9C46A` `#E76F51`.
