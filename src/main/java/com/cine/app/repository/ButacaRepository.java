package com.cine.app.repository;

import java.util.List;

import com.cine.app.domain.Butaca;
import com.cine.app.domain.Sala;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Butaca entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ButacaRepository extends JpaRepository<Butaca, Long> {

    
    List<Butaca> findBySala(Sala sala);

    @Query(
        value = "select b from Butaca b left join fetch b.sala  where b.sala.id =:id"
    )
   List<Butaca> findSalaButaca(@Param("id") Long id);



    
}
