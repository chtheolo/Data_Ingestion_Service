#!/bin/bash
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOSQL

    CREATE TABLE IF NOT EXISTS sensor_data(
        id SERIAL PRIMARY KEY,
        sensor_id VARCHAR(255) NOT NULL,
        time BIGINT NOT NULL,
        value FLOAT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (sensor_id, time)
    );

    INSERT INTO sensor_data(sensor_id, time, value) values
    ('1', 1633949941887, 22.2),
    ('1', 1633950006620, 32.65),
    ('2', 1633950042904, 102.2),
    ('2', 1633950053400, 98.7),
    ('3', 1633950063693, -2.9),
    ('3', 1633949941887, -10.2),
    ('4', 1633950071002, 665.2),
    ('4', 1633949941887, -1000.0);

    CREATE TABLE IF NOT EXISTS users(
        user_id SERIAL PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    INSERT INTO users(first_name, last_name, email, password) values
    ('John', 'Mit', 'mit@mail.com', '1234'),
    ('Chris', 'Soule', 'soule@mail.com', '1234'),
    ('Mike', 'Kith', 'kith@mail.com', '1234'),
    ('Lucas', 'Wester', 'wester@mail.com', '1234');

    CREATE TABLE IF NOT EXISTS sensors(
        sensor_id VARCHAR(255),
        type VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    INSERT INTO sensors(sensor_id) values
    ('1'),
    ('2'),
    ('3'),
    ('4');
    
    CREATE TABLE IF NOT EXISTS thresholds(
        id SERIAL PRIMARY KEY,
        threshold_max_value FLOAT,
        threshold_min_value FLOAT,
        sensor_id VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(sensor_id)
    );
    
    INSERT INTO thresholds(threshold_max_value, threshold_min_value, sensor_id) values
    (100, -100, '1'),
    (90, 10, '2');

    CREATE TABLE IF NOT EXISTS user_sensor(
        user_id INT NOT NULL,
        sensor_id VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    INSERT INTO user_sensor(user_id, sensor_id) values
    (1, '1'),
    (2, '1'),
    (1, '2'),
    (3, '3'),
    (4, '4');

EOSQL