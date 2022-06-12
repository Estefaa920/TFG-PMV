package com.cine.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cine.app.domain.Contracena;



@SuppressWarnings("unused")
@Repository
public interface ContracenaRepository extends JpaRepository<Contracena, Long>{
    
}
