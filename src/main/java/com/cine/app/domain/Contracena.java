package com.cine.app.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cache;

@Entity
@Table(name="contracena")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Contracena implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "posicion", nullable = false)
    private String posicion;


    public String getPosicion(){
        return this.posicion;
    }

    public void setPosicion(String posicion){
        this.posicion = posicion;
    }
    
}
