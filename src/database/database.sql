CREATE DATABASE galeria;

----TABLA EXPOSICIONES/FERIAS-----

CREATE TABLE exposiciones_ferias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    fecha_inauguracion DATE NOT NULL,
    fecha_cierre DATE NOT NULL,
    estado VARCHAR(10) CHECK (estado IN ('ACTUAL', 'FUTURAS', 'PASADAS')),
    imagenes BYTEA[], -- Puedes guardar las imágenes como bytea en PostgreSQL
    descripcion TEXT[], -- Array de descripciones para cada imagen
    nota_prensa TEXT,
    enlace VARCHAR(255),
    catalogo_exposicion TEXT
);

-- Trigger para determinar el estado de la exposición según las fechas
CREATE OR REPLACE FUNCTION determinar_estado() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fecha_inauguracion > CURRENT_DATE THEN
        NEW.estado := 'FUTURAS';
    ELSIF NEW.fecha_inauguracion <= CURRENT_DATE AND NEW.fecha_cierre >= CURRENT_DATE THEN
        NEW.estado := 'ACTUAL';
    ELSE
        NEW.estado := 'PASADAS';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar el trigger
CREATE TRIGGER actualizar_estado_exposicion
BEFORE INSERT OR UPDATE ON exposiciones_ferias
FOR EACH ROW EXECUTE FUNCTION determinar_estado();

--- Tabla de tecnica---
CREATE TABLE tecnica (
    id SERIAL PRIMARY KEY,
    Pintura VARCHAR(50) CHECK (Pintura IN ('Acrílico','Acuarela','Collage','mixta','óleo','pastel')),
    Dibujo  VARCHAR(50) CHECK ( Dibujo IN ('carboncillo','lápiz', 'tinta')),
    Escultura VARCHAR(50) CHECK (Escultura IN('ensamblaje', 'esculpido' , 'modelado', 'tallado','vaciado')),
    Grabado VARCHAR(50) CHECK ( Grabado IN ('colagrafía','linografía(linóleo)','litografía','monotipia','punta seca', 'xilografía')),
    Fotografia VARCHAR(50)
);
----TABLA OBRAS-----
CREATE TABLE obras (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    imagenes BYTEA[] NOT NULL,
    imagen_principal BYTEA NOT NULL,
    tema VARCHAR(50) CHECK (tema IN ('Abstracción', 'Alegoría', 'Bodegón', 'Costumbrismo', 'Desnudo', 'Erótico', 'Paisaje', 'Marina', 'Naturaleza', 'Retrato', 'Animales')),
    estilo VARCHAR(50) CHECK (estilo IN ('Abstraccionismo', 'Conceptualismo', 'Expresionismo', 'Hiperrealismo', 'Instalacionismo', 'Puntillismo', 'Realismo', 'Surrealismo')),
    tecnica_id INTEGER REFERENCES tecnica(id),
    precio DECIMAL(10, 2) CHECK (precio >= 350),
    ano_creacion INTEGER NOT NULL,
    alto_cm INTEGER NOT NULL,
    ancho_cm INTEGER NOT NULL,
    peso_kg NUMERIC(6, 2) NOT NULL,
    color_principal VARCHAR(20) NOT NULL,
    color_secundario VARCHAR(20) NOT NULL
);
------TABLA ENCARGOS ------
CREATE TABLE dimensiones (
    id SERIAL PRIMARY KEY,
    encargo_40x30 BOOLEAN,
    encargo_100x80 BOOLEAN,
    encargo_195x130 BOOLEAN,
    encargo_cuadradas_40 BOOLEAN,
    encargo_cuadradas_100 BOOLEAN,
    encargo_cuadradas_195 BOOLEAN,
    encargo_circulares_40 BOOLEAN,
    encargo_circulares_100 BOOLEAN,
    encargo_circulares_195 BOOLEAN
);

CREATE TABLE encargos (
    id SERIAL PRIMARY KEY,
    tecnica_id INTEGER NOT NULL REFERENCES tecnica(id),
    autor VARCHAR(255),
    dimensiones_id INTEGER NOT NULL REFERENCES dimensiones(id),
    estilo VARCHAR(50) CHECK (estilo IN ('Figurativo', 'Abstracto')),
    colores VARCHAR(50),
    imagen BYTEA
);

-----









