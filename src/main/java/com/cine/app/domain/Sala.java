package com.cine.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Sala.
 */
@Entity
@Table(name = "sala")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Sala implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @OneToMany(mappedBy = "sala")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "compras", "aforos", "pelicula", "sala" }, allowSetters = true)
    private Set<Proyeccion> proyeccions = new HashSet<>();

    @OneToMany(mappedBy = "sala")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "aforos", "sala" }, allowSetters = true)
    private Set<Butaca> butacas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Sala id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Sala nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Set<Proyeccion> getProyeccions() {
        return this.proyeccions;
    }

    public void setProyeccions(Set<Proyeccion> proyeccions) {
        if (this.proyeccions != null) {
            this.proyeccions.forEach(i -> i.setSala(null));
        }
        if (proyeccions != null) {
            proyeccions.forEach(i -> i.setSala(this));
        }
        this.proyeccions = proyeccions;
    }

    public Sala proyeccions(Set<Proyeccion> proyeccions) {
        this.setProyeccions(proyeccions);
        return this;
    }

    public Sala addProyeccion(Proyeccion proyeccion) {
        this.proyeccions.add(proyeccion);
        proyeccion.setSala(this);
        return this;
    }

    public Sala removeProyeccion(Proyeccion proyeccion) {
        this.proyeccions.remove(proyeccion);
        proyeccion.setSala(null);
        return this;
    }

    public Set<Butaca> getButacas() {
        return this.butacas;
    }

    public void setButacas(Set<Butaca> butacas) {
        if (this.butacas != null) {
            this.butacas.forEach(i -> i.setSala(null));
        }
        if (butacas != null) {
            butacas.forEach(i -> i.setSala(this));
        }
        this.butacas = butacas;
    }

    public Sala butacas(Set<Butaca> butacas) {
        this.setButacas(butacas);
        return this;
    }

    public Sala addButaca(Butaca butaca) {
        this.butacas.add(butaca);
        butaca.setSala(this);
        return this;
    }

    public Sala removeButaca(Butaca butaca) {
        this.butacas.remove(butaca);
        butaca.setSala(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sala)) {
            return false;
        }
        return id != null && id.equals(((Sala) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sala{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            "}";
    }
}
