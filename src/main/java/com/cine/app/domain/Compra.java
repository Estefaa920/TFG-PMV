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
 * A Compra.
 */
@Entity
@Table(name = "compra")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Compra implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @NotNull
    @Column(name = "dni", nullable = false)
    private String dni;

    @NotNull
    @Column(name = "precio_total", nullable = false)
    private Double precioTotal;

    @OneToMany(mappedBy = "compra")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "compra", "producto" }, allowSetters = true)
    private Set<Pedido> pedidos = new HashSet<>();

    @OneToMany(mappedBy = "compra")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "proyeccion", "compra", "butaca" }, allowSetters = true)
    private Set<Aforo> aforos = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "compras", "aforos", "pelicula", "sala" }, allowSetters = true)
    private Proyeccion proyeccion;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Compra id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Compra nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDni() {
        return this.dni;
    }

    public Compra dni(String dni) {
        this.setDni(dni);
        return this;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public Double getPrecioTotal() {
        return this.precioTotal;
    }

    public Compra precioTotal(Double precioTotal) {
        this.setPrecioTotal(precioTotal);
        return this;
    }

    public void setPrecioTotal(Double precioTotal) {
        this.precioTotal = precioTotal;
    }

    public Set<Pedido> getPedidos() {
        return this.pedidos;
    }

    public void setPedidos(Set<Pedido> pedidos) {
        if (this.pedidos != null) {
            this.pedidos.forEach(i -> i.setCompra(null));
        }
        if (pedidos != null) {
            pedidos.forEach(i -> i.setCompra(this));
        }
        this.pedidos = pedidos;
    }

    public Compra pedidos(Set<Pedido> pedidos) {
        this.setPedidos(pedidos);
        return this;
    }

    public Compra addPedido(Pedido pedido) {
        this.pedidos.add(pedido);
        pedido.setCompra(this);
        return this;
    }

    public Compra removePedido(Pedido pedido) {
        this.pedidos.remove(pedido);
        pedido.setCompra(null);
        return this;
    }

    public Set<Aforo> getAforos() {
        return this.aforos;
    }

    public void setAforos(Set<Aforo> aforos) {
        if (this.aforos != null) {
            this.aforos.forEach(i -> i.setCompra(null));
        }
        if (aforos != null) {
            aforos.forEach(i -> i.setCompra(this));
        }
        this.aforos = aforos;
    }

    public Compra aforos(Set<Aforo> aforos) {
        this.setAforos(aforos);
        return this;
    }

    public Compra addAforo(Aforo aforo) {
        this.aforos.add(aforo);
        aforo.setCompra(this);
        return this;
    }

    public Compra removeAforo(Aforo aforo) {
        this.aforos.remove(aforo);
        aforo.setCompra(null);
        return this;
    }

    public Proyeccion getProyeccion() {
        return this.proyeccion;
    }

    public void setProyeccion(Proyeccion proyeccion) {
        this.proyeccion = proyeccion;
    }

    public Compra proyeccion(Proyeccion proyeccion) {
        this.setProyeccion(proyeccion);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Compra)) {
            return false;
        }
        return id != null && id.equals(((Compra) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Compra{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", dni='" + getDni() + "'" +
            ", precioTotal=" + getPrecioTotal() +
            "}";
    }
}
