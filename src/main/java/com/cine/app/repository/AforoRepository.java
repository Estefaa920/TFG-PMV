package com.cine.app.repository;

import java.util.List;

import com.cine.app.domain.Aforo;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Aforo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AforoRepository extends JpaRepository<Aforo, Long> {

    @Query(
        value = "select a from Aforo a left join fetch a.proyeccion  where a.proyeccion.id =:id"
    )
   List<Aforo> findEntradas(@Param("id") Long id);
}
