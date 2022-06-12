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
 * A Pelicula.
 */
@Entity
@Table(name = "pelicula")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Pelicula implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @NotNull
    @Column(name = "descripcion", nullable = false)
    private String descripcion;

    @NotNull
    @Column(name = "duracion", nullable = false)
    private Integer duracion;

    @NotNull
    @Column(name = "en_cartelera", nullable = false)
    private Boolean enCartelera;

    @Column(name = "url_img", nullable = false)
    private String url_img;

    @NotNull
    @Column(name = "id_api", nullable = false)
    private Integer idApi;

    @OneToMany(mappedBy = "pelicula")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "compras", "aforos", "pelicula", "sala" }, allowSetters = true)
    private Set<Proyeccion> proyeccions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Pelicula id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Pelicula nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public Pelicula descripcion(String descripcion) {
        this.setDescripcion(descripcion);
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getDuracion() {
        return this.duracion;
    }

    public Pelicula duracion(Integer duracion) {
        this.setDuracion(duracion);
        return this;
    }

    public void setDuracion(Integer duracion) {
        this.duracion = duracion;
    }

    public Boolean getEnCartelera() {
        return this.enCartelera;
    }

    public Pelicula enCartelera(Boolean enCartelera) {
        this.setEnCartelera(enCartelera);
        return this;
    }

    public void setEnCartelera(Boolean enCartelera) {
        this.enCartelera = enCartelera;
    }

    public Set<Proyeccion> getProyeccions() {
        return this.proyeccions;
    }

    public String getUrl() {
        return url_img;
    }

    public void setUrl(String url_img) {
        this.url_img = url_img;
    }

    public Integer getIdApi() {
        return idApi;
    }

    public void setIdApi(Integer idApi) {
        this.idApi = idApi;
    }

    public void setProyeccions(Set<Proyeccion> proyeccions) {
        if (this.proyeccions != null) {
            this.proyeccions.forEach(i -> i.setPelicula(null));
        }
        if (proyeccions != null) {
            proyeccions.forEach(i -> i.setPelicula(this));
        }
        this.proyeccions = proyeccions;
    }

    public Pelicula proyeccions(Set<Proyeccion> proyeccions) {
        this.setProyeccions(proyeccions);
        return this;
    }

    public Pelicula addProyeccion(Proyeccion proyeccion) {
        this.proyeccions.add(proyeccion);
        proyeccion.setPelicula(this);
        return this;
    }

    public Pelicula removeProyeccion(Proyeccion proyeccion) {
        this.proyeccions.remove(proyeccion);
        proyeccion.setPelicula(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pelicula)) {
            return false;
        }
        return id != null && id.equals(((Pelicula) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pelicula{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", descripcion='" + getDescripcion() + "'" +
            ", duracion=" + getDuracion() +
            ", enCartelera='" + getEnCartelera() + "'" +
            "}";
    }
}
