package com.cine.app.repository;

import com.cine.app.domain.Proyeccion;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Proyeccion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProyeccionRepository extends JpaRepository<Proyeccion, Long> {
    @Query(value = "SELECT * FROM proyeccion p WHERE p.pelicula_id = :pelicula_id", nativeQuery = true)
    List<Proyeccion> findProyeccionByPeliculaID(@Param("pelicula_id") Long pelicula_id);

    /* @Query(value = "select p.id, count(*) from proyeccion p INNER JOIN aforo a ON p.id = a.proyeccion_id where a.reservada = false and p.pelicula_id = 1 group by p.id;", nativeQuery = true)
    List<Proyeccion> findProyeccionByPeliculaID(@Param("pelicula_id") Long pelicula_id);

    /*
     * @Query(value =
     * "select p.id, count(*) from proyeccion p INNER JOIN aforo a ON p.id = a.proyeccion_id where a.reservada = false and p.pelicula_id = 1 group by p.id;"
     * , nativeQuery = true)
     * List<Proyeccion> findProyeccionByPeliculaID(@Param("pelicula_id") Long
     * pelicula_id);
     *
     * /* @Query(value =
     * "select p.id, count(*) from proyeccion p INNER JOIN aforo a ON p.id = a.proyeccion_id where a.reservada = false and p.pelicula_id = 1 group by p.id;"
     * , nativeQuery = true)
     * Page<Proyeccion> asientosDisponibles();
     */

    @Query(value = "select * from proyeccion where date(fecha) like %:fecha% order by pelicula_id", nativeQuery = true)
    List<Proyeccion> findProyeccionByFecha2(@Param("fecha") String fecha);
}
