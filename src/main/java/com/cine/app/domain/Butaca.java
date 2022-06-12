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
 * A Butaca.
 */
@Entity
@Table(name = "butaca")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Butaca implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "posicion", nullable = false)
    private String posicion;

    @NotNull
    @Column(name = "premium", nullable = false)
    private Boolean premium;

    @OneToMany(mappedBy = "butaca")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "proyeccion", "compra", "butaca" }, allowSetters = true)
    private Set<Aforo> aforos = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "proyeccions", "butacas" }, allowSetters = true)
    private Sala sala;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Butaca id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPosicion() {
        return this.posicion;
    }

    public Butaca posicion(String posicion) {
        this.setPosicion(posicion);
        return this;
    }

    public void setPosicion(String posicion) {
        this.posicion = posicion;
    }

    public Boolean getPremium() {
        return this.premium;
    }

    public Butaca premium(Boolean premium) {
        this.setPremium(premium);
        return this;
    }

    public void setPremium(Boolean premium) {
        this.premium = premium;
    }

    public Set<Aforo> getAforos() {
        return this.aforos;
    }

    public void setAforos(Set<Aforo> aforos) {
        if (this.aforos != null) {
            this.aforos.forEach(i -> i.setButaca(null));
        }
        if (aforos != null) {
            aforos.forEach(i -> i.setButaca(this));
        }
        this.aforos = aforos;
    }

    public Butaca aforos(Set<Aforo> aforos) {
        this.setAforos(aforos);
        return this;
    }

    public Butaca addAforo(Aforo aforo) {
        this.aforos.add(aforo);
        aforo.setButaca(this);
        return this;
    }

    public Butaca removeAforo(Aforo aforo) {
        this.aforos.remove(aforo);
        aforo.setButaca(null);
        return this;
    }

    public Sala getSala() {
        return this.sala;
    }

    public void setSala(Sala sala) {
        this.sala = sala;
    }

    public Butaca sala(Sala sala) {
        this.setSala(sala);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Butaca)) {
            return false;
        }
        return id != null && id.equals(((Butaca) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Butaca{" +
            "id=" + getId() +
            ", posicion='" + getPosicion() + "'" +
            ", premium='" + getPremium() + "'" +
            "}";
    }
}
