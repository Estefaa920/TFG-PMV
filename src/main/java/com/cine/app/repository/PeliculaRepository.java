package com.cine.app.repository;

import com.cine.app.domain.Pelicula;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Pelicula entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {
    @Query(value = "SELECT * FROM pelicula p WHERE p.nombre LIKE %:nombre% and en_cartelera = true", nativeQuery = true)
    Page<Pelicula> findActivesPeliculaByName(@Param("nombre") String nombre, Pageable pageable);

    @Query(value = "SELECT * FROM pelicula p WHERE en_cartelera = true", nativeQuery = true)
    Page<Pelicula> findActives(Pageable pageable);

    @Query("select p from Pelicula p where p.enCartelera = true")
    List<Pelicula> findCartelera();
}
