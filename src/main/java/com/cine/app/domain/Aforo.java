package com.cine.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Aforo.
 */
@Entity
@Table(name = "aforo")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Aforo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "reservada", nullable = false)
    private Boolean reservada;

    @ManyToOne
    @JsonIgnoreProperties(value = { "compras", "aforos", "pelicula", "sala" }, allowSetters = true)
    private Proyeccion proyeccion;

    @ManyToOne
    @JsonIgnoreProperties(value = { "pedidos", "aforos", "proyeccion" }, allowSetters = true)
    private Compra compra;

    @ManyToOne
    @JsonIgnoreProperties(value = { "aforos", "sala" }, allowSetters = true)
    private Butaca butaca;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Aforo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getReservada() {
        return this.reservada;
    }

    public Aforo reservada(Boolean reservada) {
        this.setReservada(reservada);
        return this;
    }

    public void setReservada(Boolean reservada) {
        this.reservada = reservada;
    }

    public Proyeccion getProyeccion() {
        return this.proyeccion;
    }

    public void setProyeccion(Proyeccion proyeccion) {
        this.proyeccion = proyeccion;
    }

    public Aforo proyeccion(Proyeccion proyeccion) {
        this.setProyeccion(proyeccion);
        return this;
    }

    public Compra getCompra() {
        return this.compra;
    }

    public void setCompra(Compra compra) {
        this.compra = compra;
    }

    public Aforo compra(Compra compra) {
        this.setCompra(compra);
        return this;
    }

    public Butaca getButaca() {
        return this.butaca;
    }

    public void setButaca(Butaca butaca) {
        this.butaca = butaca;
    }

    public Aforo butaca(Butaca butaca) {
        this.setButaca(butaca);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Aforo)) {
            return false;
        }
        return id != null && id.equals(((Aforo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Aforo{" +
            "id=" + getId() +
            ", reservada='" + getReservada() + "'" +
            "}";
    }
}
