package com.cine.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Proyeccion.
 */
@Entity
@Table(name = "proyeccion")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Proyeccion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "fecha", nullable = false)
    private ZonedDateTime fecha;

    @NotNull
    @Column(name = "precio", nullable = false)
    private Double precio;

    @OneToMany(mappedBy = "proyeccion")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pedidos", "aforos", "proyeccion" }, allowSetters = true)
    private Set<Compra> compras = new HashSet<>();

    @OneToMany(mappedBy = "proyeccion")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "proyeccion", "compra", "butaca" }, allowSetters = true)
    private Set<Aforo> aforos = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "proyeccions" }, allowSetters = true)
    private Pelicula pelicula;

    @ManyToOne
    @JsonIgnoreProperties(value = { "proyeccions", "butacas" }, allowSetters = true)
    private Sala sala;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Proyeccion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getFecha() {
        return this.fecha;
    }

    public Proyeccion fecha(ZonedDateTime fecha) {
        this.setFecha(fecha);
        return this;
    }

    public void setFecha(ZonedDateTime fecha) {
        this.fecha = fecha;
    }

    public Double getPrecio() {
        return this.precio;
    }

    public Proyeccion precio(Double precio) {
        this.setPrecio(precio);
        return this;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Set<Compra> getCompras() {
        return this.compras;
    }

    public void setCompras(Set<Compra> compras) {
        if (this.compras != null) {
            this.compras.forEach(i -> i.setProyeccion(null));
        }
        if (compras != null) {
            compras.forEach(i -> i.setProyeccion(this));
        }
        this.compras = compras;
    }

    public Proyeccion compras(Set<Compra> compras) {
        this.setCompras(compras);
        return this;
    }

    public Proyeccion addCompra(Compra compra) {
        this.compras.add(compra);
        compra.setProyeccion(this);
        return this;
    }

    public Proyeccion removeCompra(Compra compra) {
        this.compras.remove(compra);
        compra.setProyeccion(null);
        return this;
    }

    public Set<Aforo> getAforos() {
        return this.aforos;
    }

    public void setAforos(Set<Aforo> aforos) {
        if (this.aforos != null) {
            this.aforos.forEach(i -> i.setProyeccion(null));
        }
        if (aforos != null) {
            aforos.forEach(i -> i.setProyeccion(this));
        }
        this.aforos = aforos;
    }

    public Proyeccion aforos(Set<Aforo> aforos) {
        this.setAforos(aforos);
        return this;
    }

    public Proyeccion addAforo(Aforo aforo) {
        this.aforos.add(aforo);
        aforo.setProyeccion(this);
        return this;
    }

    public Proyeccion removeAforo(Aforo aforo) {
        this.aforos.remove(aforo);
        aforo.setProyeccion(null);
        return this;
    }

    public Pelicula getPelicula() {
        return this.pelicula;
    }

    public void setPelicula(Pelicula pelicula) {
        this.pelicula = pelicula;
    }

    public Proyeccion pelicula(Pelicula pelicula) {
        this.setPelicula(pelicula);
        return this;
    }

    public Sala getSala() {
        return this.sala;
    }

    public void setSala(Sala sala) {
        this.sala = sala;
    }

    public Proyeccion sala(Sala sala) {
        this.setSala(sala);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Proyeccion)) {
            return false;
        }
        return id != null && id.equals(((Proyeccion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Proyeccion{" +
            "id=" + getId() +
            ", fecha='" + getFecha() + "'" +
            ", precio=" + getPrecio() +
            "}";
    }
}
